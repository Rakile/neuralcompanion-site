# Google Analytics 4 setup

The site does not contain a hard-coded GA identifier. Create a GA4 property and Web data stream for `https://neuralcompanion.app`, then set this build-time environment variable in the production host:

```text
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

When the variable is absent, no Google Analytics markup or request is emitted. When it is present, visitors first see a small consent prompt. The Google tag loads only after consent, stores only `granted` or `denied` locally, disables Google Signals and ad personalization, and does not collect form content.

## Event model

The delegated tracker accepts only: `github_click`, `download_click`, `release_click`, `discord_click`, `addon_open`, `addon_audio_play`, `install_guide_open`, `screenshot_gallery_open`, and `outbound_docs_click`. Useful parameters are `page_path`, `addon_name`, `cta_location`, and `destination`.

After deployment, use GA4 DebugView and Realtime to verify each event. Mark download or release events as key events only when they reflect the conversion you actually want to measure.
