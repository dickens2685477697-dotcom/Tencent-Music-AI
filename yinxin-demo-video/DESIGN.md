# 音信 Demo Video Design

## Style Prompt

温柔克制的产品介绍视频。画面是 4:3 横屏深色舞台，手机页面像被放在安静的展示台上，旁白文案以清晰、留白充足的方式出现。整体节奏像一封慢慢展开的音乐信件，不做过度科技感包装，不抢 `visual2` 手机稿本身的视觉表达。

## Colors

- Stage background: `#020403`
- Stage green-black: `#07110d`
- QQ Music green: `#21c879`
- Soft green: `#a7f3c7`
- Main text: `#f5f8f6`
- Muted text: `rgba(245, 248, 246, 0.68)`

## Typography

- Chinese/UI: `system-ui`, `sans-serif` for render stability; the `visual2` phone screenshots preserve the product UI typography.
- Headline: 54-76px, 600-700 weight
- Body/captions: 28-36px, 400-500 weight
- Labels: 18-22px, 500 weight

## Motion

- Primary transition: gentle blur crossfade, 0.6s.
- Topic-change transition: soft vertical drift with blur, 0.7s.
- Entrances: every scene has staggered `gsap.from()` animations.
- Ambient motion: slow green halo breathing and phone shadow drift.

## What NOT To Do

- Do not source UI screens from React routes, `visualdesign.html`, or `allpages.html`; use `visual2` assets only.
- Do not use neon purple/blue AI gradients.
- Do not crop phone screenshots in a way that hides product UI.
- Do not add busy decorative cards around the phone.
- Do not use jump cuts between product scenes.
