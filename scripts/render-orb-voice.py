"""Render publication-ready addon commentary through Neural Companion's TTS.

This utility intentionally publishes only generated WAV files. It reads the
configured backend and voice reference from the supplied NC checkout at run
time and never copies that reference into the website.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import random
import re
import sys
from types import SimpleNamespace
from typing import Any


TTS_CHUNK_TARGET_CHARS = 100
TTS_CHUNK_MAX_CHARS = 200
TTS_CHUNK_PAUSE_MS = 140


def _split_oversized_sentence(sentence: str) -> list[str]:
    parts: list[str] = []
    remaining = sentence.strip()
    while len(remaining) > TTS_CHUNK_MAX_CHARS:
        window = remaining[: TTS_CHUNK_MAX_CHARS + 1]
        split_at = max(
            window.rfind(mark, TTS_CHUNK_TARGET_CHARS)
            for mark in ("; ", ": ", ", ", " ")
        )
        if split_at < TTS_CHUNK_TARGET_CHARS:
            split_at = TTS_CHUNK_MAX_CHARS
        elif window[split_at].isspace():
            split_at += 1
        part = remaining[:split_at].strip()
        if part:
            parts.append(part)
        remaining = remaining[split_at:].strip()
    if remaining:
        parts.append(remaining)
    return parts


def _chunk_commentary(text: str) -> list[str]:
    """Match NC's standard short speech chunks to prevent Chatterbox drift."""
    normalized = re.sub(r"\s+", " ", str(text or "")).strip()
    if not normalized:
        return []

    sentences = [
        sentence.strip()
        for sentence in re.split(r"(?<=[.!?])\s+", normalized)
        if sentence.strip()
    ]
    chunks: list[str] = []
    current: list[str] = []
    current_length = 0

    for sentence in sentences:
        for part in _split_oversized_sentence(sentence):
            separator_length = 1 if current else 0
            if current and current_length + separator_length + len(part) > TTS_CHUNK_MAX_CHARS:
                chunks.append(" ".join(current))
                current = []
                current_length = 0
                separator_length = 0
            current.append(part)
            current_length += separator_length + len(part)
            if current_length >= TTS_CHUNK_TARGET_CHARS:
                chunks.append(" ".join(current))
                current = []
                current_length = 0

    if current:
        chunks.append(" ".join(current))
    return chunks


def _join_waveforms(torch_module: Any, waveforms: list[Any], sample_rate: int) -> Any:
    if not waveforms:
        raise RuntimeError("Chatterbox returned no commentary segments.")
    normalized = []
    for waveform in waveforms:
        tensor = waveform if hasattr(waveform, "dim") else torch_module.as_tensor(waveform)
        if tensor.dim() == 1:
            tensor = tensor.unsqueeze(0)
        if tensor.dim() != 2:
            raise RuntimeError(f"Unsupported Chatterbox waveform shape: {tuple(tensor.shape)}")
        normalized.append(tensor)

    pause_samples = max(1, round(sample_rate * TTS_CHUNK_PAUSE_MS / 1000))
    joined = []
    for index, tensor in enumerate(normalized):
        joined.append(tensor)
        if index < len(normalized) - 1:
            joined.append(
                torch_module.zeros(
                    (tensor.shape[0], pause_samples),
                    dtype=tensor.dtype,
                    device=tensor.device,
                )
            )
    return torch_module.cat(joined, dim=-1)


class RuntimeConfig:
    def __init__(self, values: dict[str, Any]) -> None:
        self._values = values

    def get(self, key: str, default: Any = None) -> Any:
        return self._values.get(key, default)

    @staticmethod
    def tts_device() -> str:
        return "cuda"


def _configured_values(nc_root: Path) -> dict[str, Any]:
    session_path = nc_root / "qt_session.json"
    session = json.loads(session_path.read_text(encoding="utf-8"))
    tts_runtime = dict(session.get("tts_runtime") or {})
    core = dict(tts_runtime.get("core") or {})
    chatterbox = dict(tts_runtime.get("chatterbox") or {})

    backend = str(core.get("backend") or "").strip().lower()
    if backend != "chatterbox":
        raise RuntimeError(f"Expected configured Chatterbox backend, found {backend or 'none'!r}.")

    voice_name = Path(str(core.get("voice_file") or "")).name
    voice_path = nc_root / "voices" / voice_name
    if not voice_name or not voice_path.is_file():
        raise RuntimeError("The configured companion voice file is unavailable.")

    return {
        "voice_path": str(voice_path),
        "tts_seed": int(chatterbox.get("seed", 0) or 0),
        "tts_temperature": float(chatterbox.get("temperature", 0.8) or 0.8),
        "tts_top_p": float(chatterbox.get("top_p", 0.9) or 0.9),
        "tts_top_k": int(chatterbox.get("top_k", 40) or 40),
        "tts_repeat_penalty": float(chatterbox.get("repeat_penalty", 1.2) or 1.2),
        "tts_min_p": float(chatterbox.get("min_p", 0.0) or 0.0),
        "tts_normalize_loudness": bool(chatterbox.get("normalize_loudness", False)),
        "tts_use_cloned_voice": bool(chatterbox.get("use_cloned_voice", True)),
        "tts_apply_watermark": bool(chatterbox.get("apply_watermark", True)),
        "tts_prewarm_on_start": False,
    }


def _load_scripts(script_dir: Path) -> dict[str, str]:
    scripts = {
        path.stem: path.read_text(encoding="utf-8").strip()
        for path in sorted(script_dir.glob("*.txt"))
    }
    if len(scripts) != 44:
        raise RuntimeError(f"Expected 44 addon scripts, found {len(scripts)} in {script_dir}.")
    if any(not script for script in scripts.values()):
        raise RuntimeError("Addon voice scripts must not be empty.")
    return scripts


def render(nc_root: Path, script_dir: Path, output_dir: Path) -> None:
    if output_dir.name != "addons" or output_dir.parent.name != "audio" or output_dir.parent.parent.name != "public":
        raise ValueError("Output directory must be the website's public/audio/addons directory.")

    sys.path.insert(0, str(nc_root))

    import torch

    from addons.chatterbox_tts.service import ChatterboxTTSService
    from core.tts_runtime import save_audio_file

    values = _configured_values(nc_root)
    runtime_config = RuntimeConfig(values)
    capabilities = SimpleNamespace(runtime_config=runtime_config, diagnostics=None)
    service = ChatterboxTTSService(SimpleNamespace(capabilities=capabilities))
    output_dir.mkdir(parents=True, exist_ok=True)
    scripts = _load_scripts(script_dir)

    seed = int(values["tts_seed"] or random.SystemRandom().randrange(1, 2**31 - 1))
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)

    kwargs = {
        "temperature": values["tts_temperature"],
        "top_p": values["tts_top_p"],
        "top_k": values["tts_top_k"],
        "repetition_penalty": values["tts_repeat_penalty"],
        "min_p": values["tts_min_p"],
        "norm_loudness": values["tts_normalize_loudness"],
    }

    failures: list[str] = []
    try:
        for slug, text in scripts.items():
            filename = f"{slug}.wav"
            try:
                chunks = _chunk_commentary(text)
                generated = [service.generate(chunk, **kwargs) for chunk in chunks]
                waveform = _join_waveforms(torch, generated, service.sr)
                save_audio_file(output_dir / filename, waveform, service.sr)
                print(f"Rendered addons/{filename} in {len(chunks)} stable chunks", flush=True)
            except Exception as exc:
                failures.append(f"addons/{filename}: {exc}")
                print(f"Failed addons/{filename}: {exc}", file=sys.stderr, flush=True)
    finally:
        service.close()

    if failures:
        raise RuntimeError("Voice rendering failed:\n" + "\n".join(failures))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--nc-root", type=Path, required=True)
    parser.add_argument("--script-dir", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    render(args.nc_root.resolve(), args.script_dir.resolve(), args.output_dir.resolve())


if __name__ == "__main__":
    main()
