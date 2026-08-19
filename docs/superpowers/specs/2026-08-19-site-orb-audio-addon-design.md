# Neural Companion Site Presence and Addon Showcase

## Goal

Turn the website's Companion Orb into a persistent site-wide presence, add explicit first-visit voice consent, and build an authentic addon media library from the real Neural Companion application. The redesign should feel like a deliberate extension of the desktop app rather than a generic AI product landing page.

## Scope

This iteration includes:

- a first-visit splash screen using the official Neural Companion logo;
- a persistent visitor choice for voice-enabled or silent browsing;
- a visible autoplay control in the header on every page;
- one page-specific orb line per page per browser session;
- addon narration triggered by intentional hover, keyboard focus, or mobile tap;
- a fixed orb overlay that follows the pointer without blocking the interface;
- capture and organization of screenshots for every safe, runnable addon;
- a curated subset of addon screenshots on the homepage; and
- a visual cleanup that removes generic AI-landing-page styling.

Dedicated addon detail pages and final Companion Orb or MuseTalk videos are outside this iteration. The full screenshot library will be structured so those can be added later.

## Official visual assets

`C:\Users\lainol\Downloads\NC_logo.png` is the official Neural Companion logo. It will be copied into the site's static media and used on the first-visit splash, in the header, and as the source of the restrained blue-violet accent palette.

The files in `ui_icons/side_tabs` are official addon icons. Relevant icons will be copied into the site rather than recreated. Each displayed icon will have a meaningful label or be marked decorative when adjacent text already names the addon.

## Persistent site shell

The Astro site will use client-side navigation so the browser document and audio controller survive internal page changes. A single site-presence controller will own:

- voice consent and the header toggle;
- page-entry narration;
- addon hover/focus/tap narration;
- active audio cancellation;
- orb speaking and mood state; and
- session-level playback history.

Components will communicate with the controller through typed data attributes and small custom events. Page and addon cards declare narration metadata; they will not each create competing audio players.

If client-side navigation is unavailable, ordinary links and page content will continue to work. Voice playback may become best-effort after a full browser reload, and the header must reflect whether audio actually played.

## First-visit consent

The splash appears only when no saved choice exists. It presents the official logo, a short explanation, and two equally clear actions:

- **Enter with voice** enables page and addon narration.
- **Enter silently** disables automatic narration.

The visitor's choice is stored in `localStorage`. The splash does not reappear on later visits unless site storage is cleared. The header contains an accessible voice/autoplay switch on every page, and changing it updates the stored choice immediately.

Choosing voice counts as the intentional browser gesture used to start audio. The site never attempts sound before that choice. If a browser still rejects playback, the controller keeps the interface usable, reports a silent state, and allows the visitor to try again with the header control.

## Page narration

Every route has one short, page-specific line rendered with the authorized configured companion voice. When voice is enabled, the line plays once on first entry to that route during the current browser session.

Played route identifiers are stored in `sessionStorage`. Revisiting the same page in that session stays quiet. Opening a new browser session makes each route eligible again. A newly requested line stops the current line cleanly before playback begins.

## Addon narration

Addon cards declare an addon identifier, transcript, and audio asset. Narration starts after a 650 ms hover-intent delay so merely crossing the grid does not trigger sound. Moving away before the delay cancels the request.

Each addon narrates automatically at most once per browser session. Keyboard focus receives the same behavior. On coarse-pointer devices, tapping the card or its explicit listen control requests narration. A deliberate subsequent focus, tap, or listen action may replay a line even after its automatic session entry has been recorded.

Starting addon narration interrupts page or addon narration already playing. The orb caption shows the exact transcript while the voice plays and remains available to visitors browsing silently.

## Floating Companion Orb

The large boxed orb-demo section will be removed. The replacement is a fixed overlay mounted in the shared layout so it appears on every route.

- On fine-pointer devices, the orb follows the pointer with eased motion and a small offset.
- Its visual layer uses `pointer-events: none` and is clamped to the viewport, so it cannot obscure or block controls.
- After 2.5 seconds without pointer movement, it parks in the lower-right corner.
- While audio plays, it changes to a speaking state and shows a compact nearby transcript bubble.
- On touch devices and with `prefers-reduced-motion`, it remains parked and avoids continuous tracking animation.
- The orb and caption must not cover the header autoplay switch or critical mobile navigation.

The orb remains an original HTML/CSS implementation inspired by Neural Companion's presence. It does not copy the desktop implementation or shaders.

## Addon screenshot library

The authorized checkout at `Q:\NC TEST NEW AFTER ARC\NeuralCompanion-dev` will be launched from its installed environment without update-capable launchers. The addon window can be docked into the main Neural Companion window now that both displays are available.

The supplied inventory consists of AI Presence, Artifacts, Brain/Memory, Buddy Chat, Chat, Chat Player, Chunking, Companion Orb, Desktop Bridge, Discord Chat, Dry Run, Host, Hotkeys, Multi-Persona Story Mode, MuseTalk, Persona, Scenic, SpotiSense, Story Visuals, Themes, Tutorials, VAM, Vision, Visuals, and VSeeFace. The scroll-up and scroll-down images are utility controls, not addon capture targets, but may be retained with the imported icon set.

The capture pass will:

1. Visit every addon represented by the supplied side-tab icons.
2. Capture one clean, representative application state for every safe, runnable addon.
3. Avoid activating microphones, cameras, clipboard capture, screen capture, external avatar runtimes, or account-linked services merely to create a screenshot.
4. Exclude secrets, API keys, usernames, private conversations, local paths, and personal data.
5. Record unavailable or unsafe addons in a capture manifest rather than fabricating an interface.
6. Store normalized web copies and descriptive metadata under the site's static media tree.

The homepage will show only a curated selection with distinct product value and strong captures. The complete asset library and manifest remain available for future addon pages.

## Visual direction

The official logo and authentic application screenshots carry the visual identity. The interface will use dark, mostly flat panels; precise borders; compact status labels; practical typography; and restrained cyan, blue, and violet accents derived from the logo.

The cleanup will reduce or remove:

- broad decorative glow clouds and background particles;
- repeated pill-shaped labels;
- oversized rounded cards;
- ornamental gradients without information value;
- duplicated console chrome; and
- vague promotional language.

Screenshots will be larger, copy will be more factual, spacing will follow a consistent rhythm, and interactive states will resemble the desktop application's control surfaces without reproducing them literally.

## Accessibility and privacy

- The splash traps focus while open, exposes an accessible dialog name, and restores normal document interaction after a choice.
- The header switch reports its actual state with text and `aria-pressed`.
- Voice transcripts remain readable whether sound is enabled or not.
- Keyboard and touch visitors can request the same addon information as pointer users.
- Motion respects `prefers-reduced-motion`.
- Only consent and playback identifiers are stored; no analytics, microphone input, or personal data are introduced.

## Failure handling

Missing or rejected audio never blocks navigation. The controller stops stale playback, resets the orb to idle, exposes a concise status, and leaves manual controls available. Missing screenshots fall back to existing addon icon and text rather than a broken image. An addon that cannot be safely opened is listed in the capture manifest with the reason.

## Verification

Automated tests will cover:

- first-visit consent and persistence contracts;
- the always-present header autoplay control;
- once-per-route session behavior;
- hover-intent, focus, tap, cancellation, and interruption rules;
- orb overlay semantics, viewport-safe positioning, and reduced-motion behavior;
- addon metadata and asset-reference validity; and
- graceful handling of blocked audio and missing optional screenshots.

Final verification will run `npm test`, `npm run check`, `npm run build`, and `git diff --check`. Manual validation will cover first visit, both consent choices, multiple internal routes, repeated route visits, addon hover/focus/tap narration, mobile layout, and reduced motion.
