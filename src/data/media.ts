export interface ImageMedia {
  src: `/images/${string}.webp`;
  width: number;
  height: number;
}

const image = (src: ImageMedia['src'], width: number, height: number): ImageMedia => ({ src, width, height });

export const IMAGE_MEDIA = {
  '/images/addons/ai-presence-mode/overview.webp': image('/images/addons/ai-presence-mode/overview.webp', 1800, 1170),
  '/images/addons/audio-story-mode/overview.webp': image('/images/addons/audio-story-mode/overview.webp', 1800, 1170),
  '/images/addons/buddy-chat/overview.webp': image('/images/addons/buddy-chat/overview.webp', 1800, 1170),
  '/images/addons/companion-orb-overlay/overview.webp': image('/images/addons/companion-orb-overlay/overview.webp', 1800, 1170),
  '/images/addons/conversation-replay/overview.webp': image('/images/addons/conversation-replay/overview.webp', 1480, 1268),
  '/images/addons/corsair-visual-instrument/overview.webp': image('/images/addons/corsair-visual-instrument/overview.webp', 1480, 1268),
  '/images/addons/discord-voice-bridge/overview.webp': image('/images/addons/discord-voice-bridge/overview.webp', 1800, 1170),
  '/images/addons/hotkeys/overview.webp': image('/images/addons/hotkeys/overview.webp', 1480, 1268),
  '/images/addons/main-chat-remote/overview.webp': image('/images/addons/main-chat-remote/overview.webp', 1480, 1268),
  '/images/addons/multi-persona-roleplay/overview.webp': image('/images/addons/multi-persona-roleplay/overview.webp', 1800, 1170),
  '/images/addons/musetalk-avatar/overview.webp': image('/images/addons/musetalk-avatar/overview.webp', 1800, 1170),
  '/images/addons/nc-identity-relay/overview.webp': image('/images/addons/nc-identity-relay/overview.webp', 1480, 1268),
  '/images/addons/scenic-avatar/overview.webp': image('/images/addons/scenic-avatar/overview.webp', 1800, 1170),
  '/images/addons/visual-reply/overview.webp': image('/images/addons/visual-reply/overview.webp', 1076, 1308),
  '/images/addons/visual-story-settings/overview.webp': image('/images/addons/visual-story-settings/overview.webp', 1800, 1170),
  '/images/addons/vseeface-avatar/overview.webp': image('/images/addons/vseeface-avatar/overview.webp', 1800, 1170),
  '/images/product/nc-addons.webp': image('/images/product/nc-addons.webp', 1079, 1310),
  '/images/product/nc-companion-orb.webp': image('/images/product/nc-companion-orb.webp', 1080, 1310),
  '/images/product/nc-host.webp': image('/images/product/nc-host.webp', 1800, 1012),
  '/images/product/nc-memory.webp': image('/images/product/nc-memory.webp', 1800, 1012),
  '/images/product/nc-musetalk.webp': image('/images/product/nc-musetalk.webp', 1080, 1306),
  '/images/product/nc-visual-reply.webp': image('/images/product/nc-visual-reply.webp', 1076, 1308),
} as const satisfies Record<string, ImageMedia>;

export function imageMedia(src: keyof typeof IMAGE_MEDIA): ImageMedia {
  return IMAGE_MEDIA[src];
}
