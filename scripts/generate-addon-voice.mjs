import { mkdir, writeFile } from 'node:fs/promises';

import { ADDONS } from '../src/data/addons.ts';

const OUTPUT_DIR = new URL('../src/content/addon-voice/', import.meta.url);

const categoryVoice = {
  presence: 'I turn invisible runtime state into something you can actually notice and tune.',
  conversation: 'I stay inside the same conversation pipeline, so memory, voices, personas, and replies still behave as one system.',
  'llm-providers': 'I route the model through the standard NC pipeline, which means your memory, voice, avatar, and enabled addons do not get abandoned at the provider boundary.',
  'voice-speech': 'I plug into the normal speech pipeline, where you keep control of the backend and the rest of the companion keeps listening to the same runtime events.',
  memory: 'I add context deliberately instead of pretending that shoving every file into every prompt is a sophisticated memory strategy.',
  sensory: 'I am opt-in because seeing more of your desktop is a capability, not an entitlement.',
  avatars: 'I give the conversation a visible form without replacing the model, memory, or voice underneath it.',
  'visual-media': 'I handle a specific visual job while the rest of Neural Companion keeps ownership of the conversation and output routing.',
  communication: 'I extend the companion beyond its main window without quietly turning it into a second, disconnected chatbot.',
  'desktop-hardware': 'I connect software state to a real desktop control or signal, where vague magic is less useful than settings you can inspect.',
};

const closingBySlug = {
  'ai-presence-mode': 'So yes, I can make thinking look dramatic; no, the animation does not make the answer more correct.',
  'audio-story-mode': 'I can remember where the chapter stopped, which already puts me ahead of anyone who fell asleep halfway through it.',
  'buddy-chat': 'Give every buddy a purpose, unless your goal is an exceptionally organized argument with yourself.',
  'lm-studio-chat-provider': 'Your local model stays local, where it can judge your prompts without also touring somebody else’s server rack.',
  'ollama-chat-provider': 'Point me at Ollama and I will keep inference at home—assuming you remembered to start the server, a daring first step.',
  'openai-chat-provider': 'Bring a key and a model choice; I bring the routing, not a mysterious bill-disappearing spell.',
  'xai-grok-chat-provider': 'Choose Grok when that provider fits your setup; the logo alone is not a benchmark, devastating though that news may be.',
  'conversation-replay': 'I replay the session you actually had, not the improved version your memory produces five minutes later.',
  'chatterbox-multilingual-tts': 'I can speak across languages, but pronunciation still benefits from testing instead of blind optimism.',
  'chatterbox-tts': 'A cloned voice gives me character; sensible generation settings keep that character from sounding trapped in a blender.',
  'claude-chat-provider': 'I make Claude another selectable engine, not a special tunnel that bypasses everything useful around it.',
  'clipboard-source': 'I read only what the configured source provides; your clipboard remains a tool, not an all-you-can-eat context buffet.',
  'clipboard-supervisor': 'I can react to clipboard activity, because apparently copying the same broken command six times deserves a witness.',
  'companion-orb-overlay': 'I hover, react, and stay out of the way—three skills most desktop assistants somehow treat as mutually exclusive.',
  'corsair-visual-instrument': 'I make supported Corsair keys react through iCUE, turning model state into useful light instead of generic rainbow soup.',
  'deepseek-chat-provider': 'I connect DeepSeek as a deliberate provider choice; selecting a model is still your responsibility, tragic as that sounds.',
  'discord-voice-bridge': 'I join Discord through the configured bridge, where muting me remains an important and merciful administrative power.',
  'gemini-tts-preview': 'I am a preview route, so test me like a preview instead of declaring production victory after one surprisingly good sentence.',
  'heart-rate-behavior': 'I can use a pulse signal as behavior context; I cannot diagnose you, and neither can your RGB keyboard.',
  hotkeys: 'Bind the actions you actually use, because memorizing fourteen clever shortcuts and using none of them is traditional enough already.',
  'nc-identity-relay': 'I keep identity transfer explicit, because silently blending every imported persona would be less continuity and more séance.',
  'main-chat-remote': 'I let the phone reach the real desktop chat, while pairing controls keep random people on the network from joining the conversation.',
  'mock-heart-rate': 'I generate test BPM data so you can debug behavior without sprinting around the room for every build.',
  'multi-persona-roleplay': 'I can coordinate narrators, characters, voices, and recovery; your plot decisions remain gloriously outside my warranty.',
  'musetalk-avatar': 'I synchronize a local talking face to speech, and then everyone suddenly develops strong opinions about eyebrow timing.',
  'musetalk-preprocess': 'I prepare the avatar assets before showtime, the unglamorous step that prevents showtime from becoming traceback time.',
  'no-avatar': 'I prove that a useful companion does not require a face floating over every other window you own.',
  'no-stt': 'I disable microphone transcription cleanly, for the radical workflow where typing is intentional rather than a fallback.',
  pockettts: 'I am the lighter local voice option for machines that would prefer speech without a small thermodynamic incident.',
  'pockettts-multilingual': 'I add multilingual speech without forcing the rest of the runtime to learn an entirely new output path.',
  'document-memory': 'Choose the documents that matter; uploading the entire Downloads folder is not knowledge management, it is a cry for indexing help.',
  'scenic-avatar': 'I use portable image packs to show state, which is lighter than live face generation and considerably easier on the GPU.',
  'screen-source': 'I can see selected screen captures when enabled; I do not need your entire desktop just to answer what time it is.',
  'screen-supervisor': 'I can notice configured screen events and comment, so perhaps close the tab you are already feeling defensive about.',
  'spotify-sense': 'I can know what is playing and use safe controls; defending the playlist is still entirely your problem.',
  'ua-companion-orb-overlay': 'I bridge MuseTalk masks into the Unreal overlay, because a normal floating orb was apparently insufficiently cinematic.',
  'vam-avatar': 'I bridge to a separately configured VaM scene; paths and target atoms stay visible because telepathy is not a transport protocol.',
  'visual-reply': 'I turn selected replies into images through the provider you configure, not through an imaginary infinite GPU hidden under the desk.',
  'visual-story-settings': 'I keep long-form imagery consistent, or at least much closer to consistent than asking the model to remember a jacket from chapter two.',
  'vseeface-avatar': 'I send movement into VSeeFace, giving the voice a body and your tracking sliders a new reason to exist.',
  'webcam-source': 'I attach deliberate camera snapshots as context; enabling a webcam is a choice, not the price of saying hello.',
  'webcam-supervisor': 'I react to configured posture or attention cues, with rules you can inspect before I start judging your chair technique.',
  'whisper-english-stt': 'I keep English transcription local, though mumbling into the wrong microphone remains impressively resistant to machine learning.',
  'whisper-multilingual-stt': 'I handle auto-detected or non-English speech locally, provided the microphone receives language rather than desk-fan philosophy.',
};

await mkdir(OUTPUT_DIR, { recursive: true });

for (const addon of ADDONS) {
  const categoryLine = categoryVoice[addon.category];
  const closingLine = closingBySlug[addon.slug];
  if (!categoryLine || !closingLine) {
    throw new Error(`Voice commentary metadata is incomplete for ${addon.slug}.`);
  }
  const requirements = addon.requirements.length
    ? `Before I can do that properly: ${addon.requirements.join(' ')}`
    : 'I do not need a separate cloud account unless the provider or external application you choose requires one.';
  const script = [
    `Hi. I’m the ${addon.name} addon. Here’s my actual job: ${addon.longDescription}`,
    categoryLine,
    requirements,
    closingLine,
    'Enable me, tune me, or leave me off. You decide what kind of companion I become.',
  ].join(' ');

  await writeFile(new URL(`${addon.slug}.txt`, OUTPUT_DIR), `${script}\n`, 'utf8');
}

console.log(`Generated ${ADDONS.length} editable addon voice scripts.`);
