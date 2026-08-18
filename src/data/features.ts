export type FeatureKey =
  | 'local-ai'
  | 'windows'
  | 'voice'
  | 'avatars'
  | 'memory'
  | 'visual-replies';

export interface FeatureRecord {
  key: FeatureKey;
  name: string;
  slug: string;
  route: `/${string}/`;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  requirements: readonly string[];
  relatedFeatures: readonly FeatureKey[];
  documentationUrl: string;
  sourceUrl: string;
  enabled: boolean;
}

const REPOSITORY = 'https://github.com/Rakile/NeuralCompanion';

export const FEATURES = [
  {
    key: 'local-ai',
    name: 'Local AI companion',
    slug: 'local-ai-companion',
    route: '/local-ai-companion/',
    summary:
      'Connect Neural Companion to local chat providers such as LM Studio or Ollama while keeping its speech, memory, avatar, visual-reply, and addon workflows available.',
    seoTitle: 'Local AI Companion with Ollama or LM Studio | Neural Companion',
    seoDescription:
      'Use Neural Companion with local chat models through Ollama or LM Studio on Windows, alongside configurable speech, memory, avatars, visual replies, and addons.',
    requirements: [
      'A Windows installation of Neural Companion.',
      'A running, configured local provider such as Ollama or LM Studio.',
      'A model that is available through the selected local provider.',
    ],
    relatedFeatures: ['windows', 'voice', 'memory'],
    documentationUrl: `${REPOSITORY}/blob/main/docs/manual/chat-and-tts.md`,
    sourceUrl: `${REPOSITORY}/blob/main/README.md#what-it-can-do`,
    enabled: true,
  },
  {
    key: 'windows',
    name: 'AI companion for Windows',
    slug: 'ai-companion-windows',
    route: '/ai-companion-windows/',
    summary:
      'Neural Companion is a desktop application whose current primary release targets Windows and provides guided installation, first-run tutorials, and configurable runtime presets.',
    seoTitle: 'AI Companion for Windows | Neural Companion',
    seoDescription:
      'Install Neural Companion on Windows with Python 3.11 and FFmpeg, then configure a chat provider, speech backend, memory, avatars, visual replies, and optional addons.',
    requirements: [
      'Windows.',
      'Python 3.11; the full runtime stack does not currently support Python 3.12 or newer.',
      'FFmpeg on PATH or supplied through the installer tools.',
      'A local or API chat provider.',
    ],
    relatedFeatures: ['local-ai', 'voice', 'avatars'],
    documentationUrl: `${REPOSITORY}/blob/main/docs/install.md`,
    sourceUrl: `${REPOSITORY}/blob/main/README.md#requirements`,
    enabled: true,
  },
  {
    key: 'voice',
    name: 'Voice AI companion',
    slug: 'voice-ai-companion',
    route: '/voice-ai-companion/',
    summary:
      'Neural Companion combines speech input with selectable text-to-speech addons, including Chatterbox, Gemini TTS Preview, PocketTTS, and other addon-provided backends.',
    seoTitle: 'Voice AI Companion with Configurable TTS | Neural Companion',
    seoDescription:
      'Talk with Neural Companion using speech input and configurable TTS backends, then connect the same conversation pipeline to supported avatars and replay workflows.',
    requirements: [
      'A working chat provider.',
      'A configured TTS backend.',
      'A microphone or typed input; push-to-talk can be used for speech input.',
      'Voice reference files only when the selected backend supports and requires them.',
    ],
    relatedFeatures: ['local-ai', 'avatars', 'memory'],
    documentationUrl: `${REPOSITORY}/blob/main/docs/manual/chat-and-tts.md`,
    sourceUrl: `${REPOSITORY}/blob/main/README.md#what-it-can-do`,
    enabled: true,
  },
  {
    key: 'avatars',
    name: 'AI avatars',
    slug: 'ai-avatar',
    route: '/ai-avatar/',
    summary:
      'Choose no-avatar mode or connect Neural Companion to MuseTalk, Scenic image packs, VSeeFace, or VaM, with each avatar mode configured and enabled independently.',
    seoTitle: 'AI Avatar Options for Neural Companion',
    seoDescription:
      'Explore Neural Companion avatar modes including MuseTalk, Scenic image packs, VSeeFace, VaM, and no-avatar operation, with requirements kept separate for each runtime.',
    requirements: [
      'Start with no-avatar mode while verifying chat and speech.',
      'Install or configure the external runtime required by the selected avatar mode.',
      'Use an NVIDIA CUDA GPU for MuseTalk generation and playback.',
    ],
    relatedFeatures: ['voice', 'visual-replies', 'windows'],
    documentationUrl: `${REPOSITORY}/blob/main/docs/manual/avatars.md`,
    sourceUrl: `${REPOSITORY}/blob/main/README.md#what-it-can-do`,
    enabled: true,
  },
  {
    key: 'memory',
    name: 'Persistent companion memory',
    slug: 'memory',
    route: '/memory/',
    summary:
      'Continue longer conversations with continuity summaries and a versioned long-term memory archive that supports semantic retrieval, linked image recall, and readable exports.',
    seoTitle: 'Persistent AI Companion Memory | Neural Companion',
    seoDescription:
      'Neural Companion supports continuity summaries and a versioned long-term archive with semantic retrieval, linked image recall, manual review, and readable exports.',
    requirements: [
      'Enable continuity summaries or archive retrieval for sessions that need memory beyond recent chat context.',
      'Review memory settings before relying on archived context in a conversation.',
      'Keep local session and archive data backed up according to your own privacy needs.',
    ],
    relatedFeatures: ['local-ai', 'voice', 'visual-replies'],
    documentationUrl: `${REPOSITORY}/blob/main/README.md#current-highlights`,
    sourceUrl: `${REPOSITORY}/blob/main/README.md#what-it-can-do`,
    enabled: true,
  },
  {
    key: 'visual-replies',
    name: 'Visual replies',
    slug: 'visual-replies',
    route: '/visual-replies/',
    summary:
      'Generate and manage visual replies through hosted providers or local ComfyUI workflows, with configurable workflow JSON, image size, history, and story-oriented controls.',
    seoTitle: 'AI Visual Replies with Local or Hosted Providers | Neural Companion',
    seoDescription:
      'Configure Neural Companion visual replies with hosted providers or local ComfyUI workflows, including image history, workflow selection, sizing, and story controls.',
    requirements: [
      'A configured visual-reply provider.',
      'For local ComfyUI, a running ComfyUI server and a compatible saved workflow.',
      'Explicitly enable only the screen, webcam, or clipboard sources you intend to share.',
    ],
    relatedFeatures: ['avatars', 'memory', 'local-ai'],
    documentationUrl: `${REPOSITORY}/blob/main/docs/manual/visual-reply-and-sensory.md`,
    sourceUrl: `${REPOSITORY}/blob/main/docs/visual_reply_addons.md`,
    enabled: true,
  },
] satisfies readonly FeatureRecord[];
