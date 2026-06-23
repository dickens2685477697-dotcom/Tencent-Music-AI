# 音信 Demo Product Video

This HyperFrames project creates a 4:3 product introduction video for 音信.

## Source Assets

- UI screenshots: `assets/visual2/*.png`
- Opening chat video: `assets/video/opening-chat-raw.mp4`
- Replaceable screen manifest: `page-manifest.json`
- Narration script: `narration-script.txt`

## Workflow

```bash
npm install
npm run prepare:media
npm run tts
npm run lint
npm run inspect
npm run render:draft
npm run render
```

`npm run tts` uses the local macOS Mandarin voice `Tingting`. `npm run tts:kokoro`
is included for HyperFrames Kokoro TTS if `kokoro-onnx` and `soundfile` are
available in the active Python environment.

Preview:

```bash
npm run preview
```

Studio URL:

```text
http://localhost:3017/#project/yinxin-demo-video
```

## Replacing Product Pages

Replace the matching PNG in `assets/visual2/` or update `page-manifest.json`.
The composition keeps all product UI sourced from these images.
