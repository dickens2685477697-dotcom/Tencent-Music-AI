# 音信 Demo PRD：QQ 音乐内嵌功能交互逻辑框架

> 用途：本文件用于直接发给 Codex / AI 编程助手，生成「音信」demo 的交互原型。  
> Demo 定位：QQ 音乐中的一个 AI 音乐表达功能。重点验证完整交互链路，不追求真实版权播放、真实 QQ 音乐接口和复杂后端。

---

## 1. 项目一句话

**音信：让 AI 把用户说不出口的话，转译成一首歌、一句歌词和一张可分享的动态音乐卡片。**

用户输入一段想表达但说不出口的话，AI 从歌曲/歌词中推荐合适的歌曲与关键歌词片段，生成一个可分享给朋友、恋人、家人或自己的「音信卡片」。接收者打开后可以听关键片段、阅读歌词与留言，并进行回复。

---

## 2. Demo 核心目标

本 demo 重点实现以下交互闭环：

1. 用户从 QQ 音乐首页进入「音信」功能。
2. 用户输入想表达的话、选择关系和表达场景。
3. 系统进入 AI 生成状态。
4. 系统返回 3 个候选音信方案。
5. 用户选择一个方案并进入编辑确认页。
6. 用户可以编辑卡片文案、切换歌词片段、预览播放效果。
7. 用户生成分享卡片。
8. 接收者打开分享链接，看到音乐卡片。
9. 接收者可以播放关键歌词片段，并点击「回一封音信」。
10. 接收者输入回复内容，形成简化版回信流程。

---

## 3. Demo 非目标

以下内容不作为本次 demo 的重点：

- 不需要接入真实 QQ 音乐账号体系。
- 不需要接入真实歌曲版权播放接口。
- 不需要实现真实微信分享 SDK。
- 不需要实现真实 AI 大模型接口；可以先使用 mock API，保留替换接口位置。
- 不需要实现复杂歌单、评论、私信系统。
- 不需要完整复刻 QQ 音乐所有页面，只需要做出 QQ 音乐风格的局部功能入口与功能流程。

---

## 4. 产品体验关键词

- **轻表达**：用户不需要组织完整语言，只需要输入模糊情绪。
- **低尴尬**：音乐和歌词替用户开口，减少直接表达压力。
- **可编辑**：AI 只是帮用户起草，最终由用户确认。
- **可分享**：生成结果以动态音乐卡片形式传播。
- **可回应**：接收者不是被动听歌，而是可以回一封音信。

---

## 5. 目标用户与典型场景

### 5.1 目标用户

- 想表达情绪但不知道怎么说的人。
- 想借一首歌传达心意的人。
- 喜欢在社交平台分享音乐、歌词、心情的人。
- QQ 音乐中高频使用歌单、歌词海报、歌曲分享的用户。

### 5.2 典型场景

1. **想念**：想告诉对方「我有点想你」，但直接说太直白。
2. **道歉**：想和朋友和好，但不好意思开口。
3. **告别**：想表达结束关系后的复杂情绪。
4. **鼓励**：想给朋友一句安慰或支持。
5. **自我疗愈**：写给过去的自己或现在的自己。

---

## 6. 信息架构

Demo 只需要实现以下页面：

```text
QQ音乐首页 / Home
└── 音信入口卡片 / FeatureEntry
    └── 音信创建页 / CreateYinxin
        ├── 输入内容区 / MessageInput
        ├── 关系选择 / RelationshipSelector
        ├── 场景选择 / SceneSelector
        ├── 语气选择 / ToneSelector
        └── 生成按钮 / GenerateButton
            └── AI生成中页 / Generating
                └── 候选结果页 / CandidateList
                    └── 音信编辑确认页 / EditYinxinCard
                        └── 分享预览页 / SharePreview
                            └── 接收者打开页 / ReceiverView
                                └── 回一封音信 / ReplyYinxin
```

---

## 7. 路由设计

若使用 React Router / Next Router，可按以下路径实现：

```text
/                         QQ音乐首页 demo
/yinxin                   音信创建页
/yinxin/generating        生成中状态页，可也作为 create 页内部状态
/yinxin/results           候选结果页
/yinxin/edit/:id          音信编辑确认页
/yinxin/share/:id         分享预览页，模拟发送前预览
/s/:shareId               接收者打开的分享页
/s/:shareId/reply         接收者回信页
```

说明：

- 如果 demo 时间紧，可以把 `/yinxin/generating`、`/yinxin/results`、`/yinxin/edit/:id` 做成同一个页面内的状态切换。
- `/s/:shareId` 用于模拟微信/QQ 打开后的落地页。

---

## 8. 全局交互状态机

```text
Idle
  ↓ 用户点击首页入口
CreateDraft
  ↓ 输入文字 + 选择关系/场景/语气
ReadyToGenerate
  ↓ 点击「帮我找一首歌」
Generating
  ↓ mock API 返回候选
CandidateReady
  ↓ 用户选择一个候选
EditingCard
  ↓ 用户编辑文案 / 切换歌词 / 试听
PreviewReady
  ↓ 点击「生成音信」
ShareReady
  ↓ 点击「模拟分享」
ReceiverOpened
  ↓ 接收者点击「回一封音信」
ReplyDraft
  ↓ 接收者提交回复
ReplyCreated
```

需要实现的异常状态：

```text
InputEmpty        用户未输入内容
GeneratingError   AI 生成失败
NoCandidate       没有合适歌曲
AudioUnavailable  音频无法播放，demo 中用提示替代
```

---

## 9. 页面交互逻辑详情

## 9.1 QQ 音乐首页 Demo

### 页面目标

让用户感知这是 QQ 音乐中的一个新功能入口，不需要完整复刻 QQ 音乐首页。

### 页面结构

1. 顶部搜索区：
   - 搜索框 placeholder：「搜索歌曲、歌手、歌词」
   - 右侧可有头像或会员入口，占位即可。

2. 功能入口区：
   - 推荐、歌单、排行榜等简化入口。
   - 增加一个突出入口：「音信」。

3. 音信入口卡片：
   - 标题：`音信`
   - 副标题：`把说不出口的话，变成一首歌里的音信`
   - CTA：`写一封音信`
   - 点击后进入 `/yinxin`。

### 交互规则

- 点击音信入口卡片 → 跳转到音信创建页。
- 首页其他入口可以做成不可点击或 toast：「demo 中暂未开放」。

---

## 9.2 音信创建页 CreateYinxin

### 页面目标

让用户用最小成本表达情绪，并让 AI 明确理解「发给谁」「什么场景」「什么语气」。

### 页面结构

1. 顶部导航：
   - 返回按钮。
   - 页面标题：`写一封音信`。
   - 右侧可放 `灵感` 或 `历史`，demo 可不实现。

2. 引导文案：
   - 主标题：`有开不了口的话，想用歌曲来表达？`
   - 副文案：`可以只写一句模糊的话，AI 会帮你找到合适的曲目。`

3. 文本输入框：
   - placeholder：`比如：想和朋友和好，但不想说得太直接……`
   - 支持多行输入。
   - 字数限制：200 字。
   - 显示字数：`0/200`。

4. 关系选择 RelationshipSelector：
   - `朋友`
   - `恋人`
   - `家人`
   - `自己`
   - `其他`

5. 场景选择 SceneSelector：
   - `想念`
   - `道歉`
   - `告别`
   - `鼓励`
   - `感谢`
   - `说不清的情绪`

6. 语气选择 ToneSelector：
   - `温柔`
   - `克制`
   - `真诚`
   - `轻松`
   - `文艺`

7. 生成按钮：
   - 默认文案：`帮我找一首歌`
   - 未输入文字时置灰。
   - 输入文字后高亮。

### 交互规则

- 文本输入为空时：
  - 生成按钮 disabled。
  - 点击按钮时可提示：`先写一点想表达的话吧`。

- 用户选择关系/场景/语气：
  - 每组单选。
  - 可以有默认值：关系默认 `朋友`，场景默认 `说不清的情绪`，语气默认 `真诚`。

- 点击生成按钮：
  - 保存当前 draft。
  - 进入 `Generating` 状态。
  - 调用 `generateYinxinCandidates(draft)` mock API。

---

## 9.3 AI 生成中状态 Generating

### 页面目标

把等待过程包装成「AI 正在翻找歌词」的情绪化体验，而不是普通 loading。

### 页面结构

1. 中央动效区域：
   - 可用旋转唱片、跳动歌词、音波线等简单 CSS 动效。

2. 状态文案，按时间变化：
   - 0-1s：`正在理解你的心情…`
   - 1-2s：`正在从歌词里寻找合适的表达…`
   - 2s+：`正在生成你的音信卡片…`

3. 底部提示：
   - `有些话不用直接说，歌会替你开口。`

### 交互规则

- mock API 建议延迟 1500-2200ms 返回，增强生成感。
- 成功返回 → 进入候选结果页。
- 失败 → 显示错误状态：
  - 文案：`这次没找到合适的歌，再试一次吧。`
  - 按钮：`重新生成`、`返回修改`。

---

## 9.4 候选结果页 CandidateList

### 页面目标

让用户从多个 AI 方案中选择最符合心意的一张音信。

### 页面结构

1. 顶部标题：
   - `为你找到 3 封音信`
   - 副标题：`选择最像你想说的那一封。`

2. 候选卡片列表，每张包含：
   - 歌曲封面。
   - 歌名。
   - 歌手。
   - 关键歌词。
   - AI 推荐理由。
   - 情绪标签，如 `克制想念`、`温柔道歉`。
   - 试听按钮。
   - 选择按钮：`选这首`。

3. 底部操作：
   - `重新生成`
   - `返回修改`

### 候选卡片内容示例

```text
歌名：开不了口
歌手：周杰伦
关键歌词：就是开不了口让她知道
推荐理由：这句歌词适合表达想念但不敢直接说出口的情绪。
情绪标签：克制 / 想念 / 青涩
```

### 交互规则

- 点击试听：
  - 当前卡片进入播放状态。
  - 显示 30 秒进度条。
  - 再次点击暂停。
  - 播放其他卡片时，自动暂停当前卡片。
  - demo 中可使用本地 mock 音频，也可以只做视觉模拟。

- 点击 `选这首`：
  - 保存 selectedCandidate。
  - 跳转到 `/yinxin/edit/:id`。

- 点击 `重新生成`：
  - 重新调用 mock API。
  - 返回新的候选，或随机打乱 mock 数据。

- 点击 `返回修改`：
  - 回到创建页，并保留用户已输入内容。

---

## 9.5 音信编辑确认页 EditYinxinCard

### 页面目标

让用户在分享前确认「这张卡片是不是代表我想说的话」。

### 页面结构

1. 顶部导航：
   - 返回候选结果。
   - 标题：`编辑音信`。

2. 音信卡片预览区：
   - 封面图。
   - 歌名 / 歌手。
   - 关键歌词。
   - 播放按钮。
   - 进度条。
   - 背景可做成模糊封面或渐变。

3. 文案编辑区：
   - label：`想附上的话`
   - 默认由 AI 生成一段短文案。
   - 用户可编辑，限制 80 字。
   - placeholder：`写一句你想让对方看到的话…`

4. 歌词片段切换：
   - 显示 2-3 个可选歌词片段。
   - 用户点击后，卡片预览中的关键歌词同步更新。

5. 卡片风格选择，demo 简化实现：
   - `深夜电台`
   - `绿色唱片`
   - `极简歌词`
   - 每种风格只改变背景样式，不改变交互。

6. 底部主按钮：
   - `生成音信卡片`

### 交互规则

- 用户修改文案时，卡片预览实时更新。
- 用户切换歌词片段时，播放片段的 startTime/endTime 也要同步切换。
- 点击播放按钮：
  - 播放当前歌词片段的模拟音频。
  - 若无音频，显示模拟播放进度即可。
- 点击 `生成音信卡片`：
  - 生成 shareId。
  - 保存 cardData 到本地状态或 localStorage。
  - 跳转 `/yinxin/share/:id`。

---

## 9.6 分享预览页 SharePreview

### 页面目标

模拟用户把音信分享到微信/QQ 前看到的最终效果。

### 页面结构

1. 顶部标题：
   - `你的音信已经写好`

2. 分享卡片大预览：
   - 封面。
   - 歌名 / 歌手。
   - 关键歌词。
   - 用户附言。
   - 播放按钮。
   - `来自 QQ音乐 · 音信`

3. 分享方式按钮：
   - `分享给微信好友`
   - `分享到 QQ`
   - `复制链接`

4. demo 辅助按钮：
   - `模拟接收者打开`

### 交互规则

- 点击 `分享给微信好友`：
  - 显示 toast：`demo 中已模拟分享`。
  - 可同时展示一个小弹窗：`对方打开后会看到这张音信卡片。`

- 点击 `复制链接`：
  - 将 `/s/:shareId` 写入剪贴板。
  - toast：`链接已复制`。

- 点击 `模拟接收者打开`：
  - 跳转到 `/s/:shareId`。

---

## 9.7 接收者打开页 ReceiverView

### 页面目标

让接收者明确感知：这不是普通歌曲分享，而是一封专门写给 TA 的音乐信息。

### 页面结构

1. 顶部来源提示：
   - `你收到了一封音信`
   - 副文案：`TA 让一首歌替 TA 说了这些话。`

2. 主音乐卡片：
   - 封面大图。
   - 歌名 / 歌手。
   - 关键歌词。
   - 发送者附言。
   - 播放关键片段按钮。
   - 播放进度条。

3. 情绪反馈区：
   - `我听懂了`
   - `有点想回 TA`
   - `收藏这封音信`

4. 主按钮：
   - `回一封音信`

5. 次按钮：
   - `去 QQ音乐听完整首歌`（如果不是在QQ音乐界面打开的情况）
   - demo 中点击显示 toast。

### 交互规则

- 进入页面后不自动播放，必须由用户主动点击播放。
- 点击播放按钮：
  - 播放或模拟播放 30 秒关键歌词片段。
- 点击情绪反馈：
  - 选中状态高亮。
  - toast：`已记录你的回应`。
- 点击 `回一封音信`：
  - 跳转 `/s/:shareId/reply`。

---

## 9.8 回一封音信 ReplyYinxin

### 页面目标

形成双向互动闭环。接收者不是只能听，而是可以用同样方式回复。

### 页面结构

1. 顶部标题：
   - `回一封音信`

2. 引导文案：
   - `听完之后，你想对 TA 说什么？`

3. 输入框：
   - placeholder：`比如：其实我也一直想和你说……`
   - 字数限制：200 字。

4. 快捷回复：
   - `我听懂了`
   - `我也想你`
   - `谢谢你告诉我`
   - `我们聊聊吧`

5. 生成按钮：
   - `生成我的回信`

### 交互规则

- 点击快捷回复：
  - 将文案填入输入框，用户仍可编辑。
- 点击生成按钮：
  - demo 简化方案：复用创建音信的候选生成流程。
  - 可跳回 `/yinxin/results`，但需要带上 reply mode 状态。
- 若时间不足：
  - 点击后显示完成页：`你的回信已经写好`，并展示一张简化卡片。

---

## 10. 关键组件拆分建议

建议拆成以下组件，方便后续视觉同学只改样式：

```text
src/
  app/
    routes/
      HomePage.tsx
      CreateYinxinPage.tsx
      CandidateListPage.tsx
      EditYinxinPage.tsx
      SharePreviewPage.tsx
      ReceiverViewPage.tsx
      ReplyYinxinPage.tsx
  components/
    layout/
      QQMusicShell.tsx
      PageHeader.tsx
      BottomActionBar.tsx
    yinxin/
      FeatureEntryCard.tsx
      MessageInput.tsx
      ChipSelector.tsx
      GeneratingView.tsx
      CandidateCard.tsx
      YinxinMusicCard.tsx
      LyricSegmentPicker.tsx
      MockAudioPlayer.tsx
      ShareActionPanel.tsx
      EmotionFeedbackBar.tsx
  data/
    mockSongs.ts
    mockCandidates.ts
  services/
    yinxinApi.ts
    shareStore.ts
  types/
    yinxin.ts
  styles/
    tokens.css
    yinxin.css
```

要求：

- 交互逻辑放在 page / hooks / service 中。
- 视觉样式集中放在 css 文件或 styled tokens 中。
- 不要把大量视觉样式写死在业务逻辑里。
- mock 数据、API 逻辑、卡片 UI 分离。

---

## 11. 数据结构设计

### 11.1 Draft 输入数据

```ts
export type Relationship = 'friend' | 'lover' | 'family' | 'self' | 'other';
export type Scene = 'miss' | 'apology' | 'farewell' | 'encourage' | 'thanks' | 'mixed';
export type Tone = 'gentle' | 'restrained' | 'sincere' | 'light' | 'poetic';

export interface YinxinDraft {
  message: string;
  relationship: Relationship;
  scene: Scene;
  tone: Tone;
  createdAt: number;
  mode?: 'create' | 'reply';
  replyToShareId?: string;
}
```

### 11.2 歌曲与歌词片段

```ts
export interface SongInfo {
  songId: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl: string;
  audioPreviewUrl?: string;
}

export interface LyricSegment {
  segmentId: string;
  text: string;
  startTime: number;
  endTime: number;
  emotionTags: string[];
}
```

### 11.3 AI 候选结果

```ts
export interface YinxinCandidate {
  candidateId: string;
  song: SongInfo;
  primaryLyric: LyricSegment;
  alternativeLyrics: LyricSegment[];
  aiReason: string;
  cardCopy: string;
  emotionLabel: string;
  confidence: number;
}
```

### 11.4 最终分享卡片

```ts
export interface YinxinCardData {
  shareId: string;
  candidateId: string;
  song: SongInfo;
  selectedLyric: LyricSegment;
  userMessage: string;
  aiReason?: string;
  cardStyle: 'midnight' | 'green' | 'minimal';
  senderName?: string;
  receiverName?: string;
  createdAt: number;
}
```

---

## 12. Mock API 设计

### 12.1 生成候选

```ts
export async function generateYinxinCandidates(
  draft: YinxinDraft
): Promise<YinxinCandidate[]> {
  // demo 阶段使用 mock 数据
  // 模拟 1500-2200ms 延迟
  // 根据 scene / tone 返回不同候选
}
```

### 12.2 保存分享卡片

```ts
export function saveYinxinCard(card: YinxinCardData): void {
  // demo 阶段可使用 localStorage
}
```

### 12.3 读取分享卡片

```ts
export function getYinxinCard(shareId: string): YinxinCardData | null {
  // 从 localStorage 读取
  // 若没有找到，返回一个默认 mock card，避免 demo 断流
}
```

---

## 13. Mock 数据建议

至少准备 6 首歌的 mock 数据，覆盖不同情绪：

```ts
const mockCandidates = [
  {
    song: {
      songId: 'song_001',
      title: '开不了口',
      artist: '周杰伦',
      coverUrl: '/covers/kbl.jpg'
    },
    primaryLyric: {
      segmentId: 'lyric_001',
      text: '就是开不了口让她知道',
      startTime: 42,
      endTime: 72,
      emotionTags: ['想念', '克制', '青涩']
    },
    aiReason: '这句歌词适合表达想说却说不出口的心情。',
    cardCopy: '有些话我还是说不出口，所以想让这首歌替我说。',
    emotionLabel: '克制想念',
    confidence: 0.92
  }
]
```

注意：demo 中不要强依赖真实封面和真实音频。可以用本地占位图和模拟播放器。

---

## 14. 播放器交互逻辑

组件：`MockAudioPlayer`

### 状态

```ts
type PlayerState = 'idle' | 'playing' | 'paused' | 'ended';
```

### 行为

- 点击播放：`idle/paused/ended → playing`
- 点击暂停：`playing → paused`
- 播放进度到 100%：`playing → ended`
- 切换歌曲或歌词片段：重置进度为 0
- 页面内同时只允许一个播放器处于 playing 状态

### Demo 实现方式

- 不接真实音频时，用 `setInterval` 模拟 30 秒进度。
- 进度条从 0% 到 100%。
- 播放按钮状态切换即可。

---

## 15. 视觉与样式约束

虽然本 PRD 重点是交互逻辑，但 demo 需要保持 QQ 音乐语境。

### 15.1 基础风格

- 主色：QQ 音乐绿色，可使用 `#1ED760` 或接近色。
- 背景：深色音乐感背景或浅色首页背景均可，但功能页建议偏沉浸。
- 卡片：圆角、大封面、歌词突出。
- 动效：轻量即可，如唱片旋转、音波跳动、进度条。

### 15.2 样式分离要求

- 页面逻辑和 CSS 分离。
- 所有颜色、圆角、阴影、间距写到 `tokens.css`。
- 视觉同学后续只需要修改 `styles/` 和组件 JSX 结构，不需要改业务逻辑。

### 15.3 建议 CSS Token

```css
:root {
  --color-brand: #1ed760;
  --color-bg: #0b0f0d;
  --color-bg-soft: #121816;
  --color-card: rgba(255, 255, 255, 0.08);
  --color-text: #ffffff;
  --color-text-secondary: rgba(255, 255, 255, 0.68);
  --radius-card: 24px;
  --radius-button: 999px;
  --shadow-card: 0 16px 48px rgba(0, 0, 0, 0.28);
}
```

---

## 16. 页面验收标准

### 16.1 首页

- 能看到 QQ 音乐风格首页。
- 能看到「音信」入口。
- 点击入口能进入创建页。

### 16.2 创建页

- 能输入文字。
- 能选择关系、场景、语气。
- 输入为空时不能生成。
- 点击生成后进入 loading。

### 16.3 候选页

- 至少展示 3 个候选。
- 每个候选有歌名、歌手、歌词、推荐理由和试听按钮。
- 可以选择其中一个进入编辑页。

### 16.4 编辑页

- 能看到完整音信卡片预览。
- 能编辑用户附言。
- 能切换歌词片段。
- 能切换卡片风格。
- 点击生成后进入分享页。

### 16.5 分享页

- 能看到最终分享卡片。
- 能复制链接或模拟分享。
- 能点击「模拟接收者打开」。

### 16.6 接收者页

- 能看到「你收到了一封音信」。
- 能播放/模拟播放关键歌词片段。
- 能点击情绪反馈。
- 能进入回信页。

### 16.7 回信页

- 能输入回复。
- 能点击快捷回复。
- 能生成简化回信结果或复用生成流程。

---

## 17. Codex 实现任务拆分

请按以下顺序实现：

### Step 1：搭建页面与路由

- 创建所有页面路由。
- 先使用静态 mock 数据跑通页面跳转。

### Step 2：实现创建页表单状态

- 实现输入框、chip 单选、按钮 disabled 状态。
- 点击生成后进入 loading。

### Step 3：实现 mock API

- 创建 `generateYinxinCandidates`。
- 根据用户输入返回 3 个候选。
- 加入模拟延迟。

### Step 4：实现候选结果页

- 展示候选卡片。
- 实现试听按钮的模拟播放。
- 实现选择候选。

### Step 5：实现编辑确认页

- 展示选中歌曲和歌词。
- 实现文案编辑。
- 实现歌词片段切换。
- 实现卡片风格切换。

### Step 6：实现分享数据保存

- 生成 shareId。
- 使用 localStorage 保存 YinxinCardData。
- 分享页和接收者页通过 shareId 读取数据。

### Step 7：实现接收者打开与回信流程

- 展示接收者视角卡片。
- 实现情绪反馈按钮。
- 实现回信页。

### Step 8：整理样式与动效

- 使用 QQ 音乐绿色作为主色。
- 增加唱片旋转、音波 loading、播放进度条。
- 保证移动端宽度优先，桌面端居中展示手机壳容器。

---

## 18. 重要交互细节

### 18.1 输入不是搜索歌，而是表达意图

创建页输入框不要写成「搜索歌曲」。它应该引导用户输入情绪或想说的话。

正确示例：

```text
想和朋友和好，但不想说得太直接。
```

错误示例：

```text
搜索周杰伦的歌。
```

### 18.2 AI 推荐不是普通歌单推荐

候选结果页必须展示 `推荐理由`，让用户理解为什么这句歌词适合自己。

### 18.3 结果不是歌词海报

音信卡片要强调：

- 有关键歌词片段播放。
- 有发送者附言。
- 有接收者回复入口。
- 是动态音乐信息，不是静态图片。

### 18.4 分享后是接收者视角

`/s/:shareId` 不应和编辑页完全一样。它应该更像「收到一封信」，而不是「编辑一张卡片」。

---

## 19. 最小可行 Demo 版本

如果时间非常紧，只实现以下最小链路：

```text
首页入口
→ 创建页输入一句话
→ loading
→ 展示 3 个候选
→ 选择 1 个
→ 编辑附言
→ 生成卡片
→ 模拟接收者打开
→ 播放关键片段
→ 点击回一封音信
```

可以暂时省略：

- 真实音频播放。
- 真实分享。
- 登录。
- 历史记录。
- 多种卡片风格。
- 复杂回信生成。

---

## 20. 建议的默认文案

### 首页入口

```text
音信
把说不出口的话，变成一首歌里的音信
写一封音信
```

### 创建页

```text
有什么话，想让歌替你说？
可以只写一句模糊的话，AI 会帮你找到合适的歌词。
```

### 生成中

```text
正在理解你的心情…
正在从歌词里寻找合适的表达…
正在生成你的音信卡片…
```

### 候选页

```text
为你找到 3 封音信
选择最像你想说的那一封
```

### 编辑页

```text
想附上的话
有些话我还是说不出口，所以想让这首歌替我说。
```

### 分享页

```text
你的音信已经写好
对方打开后，会看到这张专属音乐卡片。
```

### 接收者页

```text
你收到了一封音信
TA 让一首歌替 TA 说了这些话。
```

### 回信页

```text
听完之后，你想对 TA 说什么？
```

---

## 21. 给 Codex 的最终指令

请基于以上 PRD 实现一个前端 demo。若当前项目已有技术栈，请沿用现有技术栈；若没有，请使用 React + TypeScript + Vite。实现时优先保证交互流程完整、状态清晰、组件拆分合理、样式与逻辑分离。真实 AI、真实 QQ 音乐 API、真实分享、真实音频都先用 mock 实现，但代码结构中保留未来替换接口的位置。
