# Addon media pipeline

## Refresh icons and screenshots

Run the checked-in preparation script against a trusted Neural Companion checkout. It copies only the approved icons and converts curated application captures to WebP.

```powershell
node scripts\sync-addon-registry.mjs "Q:\NC TEST NEW AFTER ARC\NeuralCompanion-dev"
pwsh -NoProfile -File scripts\prepare-media.ps1 -NcRoot "Q:\NC TEST NEW AFTER ARC\NeuralCompanion-dev" -Ffmpeg "C:\ffmpeg\bin\ffmpeg.exe"
node scripts\generate-capture-manifest.mjs
```

Manual captures must use a clean test profile. Redact local paths, API credentials, account names, device identifiers, LAN addresses, and pairing codes before adding `screenshotSrc` to `src/data/addons.ts`.

## Regenerate addon voice

The renderer reads Neural Companion's configured Chatterbox backend and voice at runtime. It never copies the private voice reference into this repository.
Long commentary is rendered in NC-sized sentence chunks and joined with short pauses. Do not replace this with a single Chatterbox generation call: long one-pass generations can drift into unintelligible speech near the ending.

```powershell
node scripts\generate-addon-voice.mjs
& "Q:\NC TEST NEW AFTER ARC\NeuralCompanion-dev\.venv\Scripts\python.exe" scripts\render-orb-voice.py `
  --nc-root "Q:\NC TEST NEW AFTER ARC\NeuralCompanion-dev" `
  --script-dir src\content\addon-voice `
  --output-dir public\audio\addons
pwsh -NoProfile -File scripts\optimize-addon-audio.ps1 `
  -InputDir public\audio\addons `
  -OutputDir public\audio\addons `
  -Ffmpeg "C:\ffmpeg\bin\ffmpeg.exe" `
  -RemoveSource
```

The final site ships 112 kbps MP3 files and preloads metadata only. Keep the `.txt` files as the editable source of truth.
