import type { FeatureKey } from './features.ts';

export interface IntegrationRecord {
  name: string;
  slug: string;
  route: `/integrations/${string}/`;
  category: 'LLM provider' | 'Avatar runtime';
  summary: string;
  seoTitle: string;
  seoDescription: string;
  requirements: readonly string[];
  configuration: readonly string[];
  relatedFeatures: readonly FeatureKey[];
  documentationUrl: string;
  sourceUrl: string;
  enabled: boolean;
}

const REPOSITORY = 'https://github.com/Rakile/NeuralCompanion';

export const INTEGRATIONS = [
  {
    name: 'Ollama',
    slug: 'ollama',
    route: '/integrations/ollama/',
    category: 'LLM provider',
    summary:
      'The Ollama chat-provider addon connects Neural Companion to models served by a local Ollama installation while preserving the normal conversation and addon pipeline.',
    seoTitle: 'Use Ollama with Neural Companion',
    seoDescription:
      'Connect Neural Companion to an Ollama server for local model conversations on Windows while retaining speech, memory, avatar, visual-reply, and addon workflows.',
    requirements: [
      'A working Neural Companion installation.',
      'Ollama installed and running with a model available.',
      'The Ollama chat-provider addon enabled in Neural Companion.',
    ],
    configuration: [
      'Start Ollama and make the intended chat model available.',
      'Select Ollama as the chat provider in Neural Companion and choose the model exposed by the server.',
      'Test text chat before adding speech, avatars, or sensory addons.',
    ],
    relatedFeatures: ['local-ai', 'voice', 'memory'],
    documentationUrl: `${REPOSITORY}/tree/main/addons/ollama_provider`,
    sourceUrl: `${REPOSITORY}/blob/main/addons/ollama_provider/addon.json`,
    enabled: true,
  },
  {
    name: 'LM Studio',
    slug: 'lm-studio',
    route: '/integrations/lm-studio/',
    category: 'LLM provider',
    summary:
      'The LM Studio chat-provider addon lets Neural Companion use a model served from LM Studio as a local conversation backend through the normal provider registry.',
    seoTitle: 'Use LM Studio with Neural Companion',
    seoDescription:
      'Run a model in LM Studio and select it as Neural Companion’s local chat backend, then add speech, memory, avatars, visual replies, and optional addons as needed.',
    requirements: [
      'A working Neural Companion installation.',
      'LM Studio running with a compatible chat model loaded and its local server available.',
      'The LM Studio chat-provider addon enabled in Neural Companion.',
    ],
    configuration: [
      'Start LM Studio, load a chat model, and start its local server.',
      'Select LM Studio as the Neural Companion chat provider.',
      'Verify typed chat in no-avatar mode before enabling additional pipelines.',
    ],
    relatedFeatures: ['local-ai', 'voice', 'memory'],
    documentationUrl: `${REPOSITORY}/blob/main/docs/manual/first-run.md`,
    sourceUrl: `${REPOSITORY}/blob/main/addons/lmstudio_provider/addon.json`,
    enabled: true,
  },
  {
    name: 'MuseTalk',
    slug: 'musetalk',
    route: '/integrations/musetalk/',
    category: 'Avatar runtime',
    summary:
      'MuseTalk provides local avatar video generation from prepared avatar packs and runs in an isolated environment because it is Neural Companion’s most hardware-sensitive avatar mode.',
    seoTitle: 'MuseTalk Avatars with Neural Companion',
    seoDescription:
      'Set up MuseTalk avatar generation for Neural Companion with its isolated runtime, model weights, prepared avatar packs, NVIDIA CUDA GPU, and performance profiles.',
    requirements: [
      'An NVIDIA CUDA GPU.',
      'The isolated MuseTalk runtime and expected model weights.',
      'A prepared avatar pack; large demo packs are distributed separately.',
    ],
    configuration: [
      'Install Neural Companion with the isolated MuseTalk runtime selected.',
      'Install or prepare an avatar pack under avatar_packs/<pack_id>/.',
      'Select MuseTalk as the avatar engine, then use Dry Run and performance profiles to tune the machine.',
    ],
    relatedFeatures: ['avatars', 'voice', 'windows'],
    documentationUrl: `${REPOSITORY}/blob/main/docs/manual/musetalk.md`,
    sourceUrl: `${REPOSITORY}/blob/main/docs/manual/musetalk.md`,
    enabled: true,
  },
  {
    name: 'VSeeFace',
    slug: 'vseeface',
    route: '/integrations/vseeface/',
    category: 'Avatar runtime',
    summary:
      'Neural Companion can send VMC-style avatar signals to the external VSeeFace application and provides controls for body and face movement once the runtime is configured.',
    seoTitle: 'Connect VSeeFace to Neural Companion',
    seoDescription:
      'Use VSeeFace as an external avatar runtime for Neural Companion through VMC-style signals, with configurable face and body movement controls in the avatar workflow.',
    requirements: [
      'VSeeFace installed separately.',
      'A compatible VSeeFace avatar setup.',
      'VMC communication configured between Neural Companion and VSeeFace.',
    ],
    configuration: [
      'Start VSeeFace and load the intended avatar.',
      'Select VSeeFace as the Neural Companion avatar engine and configure the VMC connection.',
      'Tune eye, breathing, shoulder, and body movement controls after communication is verified.',
    ],
    relatedFeatures: ['avatars', 'voice', 'windows'],
    documentationUrl: `${REPOSITORY}/blob/main/docs/manual/avatars.md`,
    sourceUrl: `${REPOSITORY}/blob/main/addons/vseeface_avatar/addon.json`,
    enabled: true,
  },
  {
    name: 'VaM',
    slug: 'vam',
    route: '/integrations/vam/',
    category: 'Avatar runtime',
    summary:
      'The VaM avatar addon connects Neural Companion to a separately installed Virt-A-Mate runtime through VMC and/or the Neural Companion file bridge and plugin.',
    seoTitle: 'Connect VaM to Neural Companion',
    seoDescription:
      'Configure Neural Companion’s Virt-A-Mate integration using VMC or the provided file bridge and plugin, then route avatar motion and optional audio through VaM.',
    requirements: [
      'Virt-A-Mate installed separately.',
      'The Neural Companion VaM bridge or VMC connection configured.',
      'A target atom and compatible plugin setup inside VaM.',
    ],
    configuration: [
      'Set the VaM root and Neural Companion bridge path.',
      'Configure the target atom, plugin storable, VMC host, and VMC port.',
      'Verify the detected setup before launching VaM Desktop or VaM VR from the addon controls.',
    ],
    relatedFeatures: ['avatars', 'voice', 'windows'],
    documentationUrl: `${REPOSITORY}/blob/main/docs/manual/avatars.md`,
    sourceUrl: `${REPOSITORY}/blob/main/addons/vam_avatar/addon.json`,
    enabled: true,
  },
] satisfies readonly IntegrationRecord[];
