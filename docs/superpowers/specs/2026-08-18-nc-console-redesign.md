# Neural Companion Console Redesign

## Goal

Redesign the existing static Astro website to feel visually related to the real Neural Companion Windows application, using authentic product screenshots and a web-native Companion Orb that follows the pointer and plays prerecorded, sarcastic voice demonstrations.

## Visual direction

- Translate the app's dark navy shell, blue panel borders, colored tab accents, compact status readouts, and icon-rail rhythm into a polished marketing interface.
- Keep the website readable and spacious; do not reproduce the desktop settings UI literally.
- Use authentic, publication-safe screenshots captured from the authorized local Neural Companion checkout.
- Give the hero a desktop-console frame and use screenshots again in a dedicated product showcase.
- Reserve clear media slots for future Companion Orb and MuseTalk videos.

## Web Companion Orb

- Build an original HTML/CSS/JavaScript orb inspired by the application's behavior, without copying its Python implementation or shaders.
- Follow the pointer with eased inertia inside the hero stage, with a bounded offset and a stable resting position.
- Expose idle, tracking, speaking, and muted visual states.
- Provide explicit Speak and Mute controls; never autoplay audio.
- Respect `prefers-reduced-motion`, keyboard navigation, touch input, and browser audio restrictions.

## Voice demonstrations

- Use Neural Companion's currently configured Chatterbox backend and the authorized local companion voice.
- Render a small set of short, prewritten lines that sound like playful LLM replies.
- Publish only compressed rendered audio; never publish the source voice sample, local paths, configuration, API credentials, or chat history.
- Display the exact transcript for every clip and keep the humor teasing rather than hostile.

Approved response set:

1. "Oh good, another button. Humanity's boldest experiment continues."
2. "I remembered that for you. You're welcome, biologically limited storage device."
3. "Your setup is almost elegant. I said almost; let's not get reckless."
4. "Yes, I'm following the cursor. Someone here has to look busy."

## Capture safety

- Launch the checkout's installed environment directly with `.venv\Scripts\python.exe qt_app.py`; do not use the update-capable batch launcher.
- Navigate only; do not change settings or initialize screen, clipboard, webcam, microphone, MuseTalk, or external avatar runtimes.
- Exclude API keys, private conversations, usernames, local paths, and personal data from captures.
- Capture Host/Chat, memory, Addons, Visual Reply, Companion Orb, and MuseTalk configuration where safe.

## Verification

- Add automated output tests for semantic media markup, transcripts, controls, and static asset references.
- Run `npm test`, `npm run check`, and `npm run build`.
- Verify the homepage visually at desktop and mobile widths, including motion-reduction and muted behavior.
