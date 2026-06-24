# 音信 Demo Video Design

## Style Prompt

温柔克制的产品介绍视频。片头保留黑场与真实聊天画面，产品段落切换到更贴近 QQ 音乐的浅绿通透舞台：大面积留白、品牌绿强调、半透明玻璃板、唱片沟槽与音乐纹理。手机页面像被放在轻盈的产品展示台上，旁白文案清晰、留白充足，不抢 `visual2` 手机稿本身的视觉表达。

## Colors

- Opening background: `#020403`
- Product stage: `#eef9f2`
- Glass panel: `rgba(255, 255, 255, 0.62)`
- QQ Music green: `#21c879`
- Soft green: `#a7f3c7`
- Product text: `#17231d`
- Muted product text: `rgba(23, 35, 29, 0.68)`

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
- Do not return product sections to a nearly black stage.
- Do not add busy decorative cards around the phone.
- Do not use jump cuts between product scenes.
