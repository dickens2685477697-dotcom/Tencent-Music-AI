# 音信 Demo 运行与视觉修改指南

## 1. 项目简介

这是一个基于 React、TypeScript、Vite 和 React Router 的「音信」前端原型。

当前版本采用低保真灰度线框风格，完整链路包括：

```text
QQ音乐首页
→ 创建音信
→ AI 生成中
→ 候选结果
→ 编辑确认
→ 装入信封与分享
→ 接收者打开
→ 直接留言或音乐回信
→ 我寄出的音信与回复管理
```

AI、歌曲、音频、分享和后端存储均为 mock 实现，不依赖真实 QQ 音乐接口。

## 2. 环境要求

- Node.js 20 或更高版本
- npm 10 或兼容版本
- 推荐使用 Chrome、Edge 或 Safari 最新版本

检查本机环境：

```bash
node --version
npm --version
```

## 3. 快速运行

### macOS 双击启动

双击项目根目录中的：

```text
启动音信.command
```

脚本会在缺少依赖时自动执行 `npm install`，随后启动开发服务器并打开浏览器。

### 终端启动

在项目根目录执行：

```bash
npm install
npm run start
```

默认地址：

```text
http://127.0.0.1:5173
```

需要让同一局域网中的其他设备访问时，使用：

```bash
npm run dev
```

### 不要直接双击运行应用

React + Vite 应用不能通过 `file://` 直接加载 TypeScript 模块。直接打开根目录的 `index.html` 时，只会看到启动提示页，不是完整应用。

## 4. 常用命令

| 命令 | 用途 |
|---|---|
| `npm run start` | 启动本地服务并自动打开浏览器 |
| `npm run dev` | 启动局域网可访问的开发服务 |
| `npm test` | 执行 Vitest 自动化测试 |
| `npm run test:watch` | 监听文件变化并持续运行测试 |
| `npm run typecheck` | 执行 TypeScript 类型检查 |
| `npm run build` | 类型检查并生成生产构建 |

生产文件输出到 `dist/`，该目录不提交到 Git。

## 5. 页面路由

| 路由 | 页面 |
|---|---|
| `/` | QQ 音乐首页 Demo |
| `/yinxin` | 创建音信 |
| `/yinxin/generating` | AI 生成中 |
| `/yinxin/results` | 候选结果 |
| `/yinxin/edit/:id` | 编辑确认 |
| `/yinxin/share/:id` | 装信封与分享预览 |
| `/yinxin/sent` | 我寄出的音信列表 |
| `/yinxin/sent/:shareId` | 寄出音信与回复详情 |
| `/s/:shareId` | 接收者打开分享链接 |
| `/s/:shareId/reply` | 接收者回复音信 |

路由入口位于：

```text
src/App.tsx
```

## 6. 项目目录

```text
src/
  app/routes/          页面组件与页面交互
  components/layout/   页面壳、顶部导航等布局组件
  components/yinxin/   音信卡片、播放器、选择器、弹窗等组件
  context/             全局业务状态与播放器状态
  data/                mock 歌曲和候选数据
  services/            mock API、分享卡片和回复存储
  styles/              设计变量、基础样式、高保真样式、线框样式
  test/                自动化测试
  types/               TypeScript 数据结构
```

## 7. 样式文件优先级

样式在 `src/main.tsx` 中按以下顺序加载：

```ts
import './styles/tokens.css';
import './styles/base.css';
import './styles/yinxin.css';
import './styles/wireframe.css';
```

后加载的样式优先级更高，因此当前实际显示效果主要由 `wireframe.css` 决定。

| 文件 | 作用 |
|---|---|
| `src/styles/tokens.css` | 原高保真主题变量、间距、圆角和动画时间 |
| `src/styles/base.css` | 页面壳、基础按钮、Header、Toast 和响应式基础规则 |
| `src/styles/yinxin.css` | 原高保真页面和业务组件样式 |
| `src/styles/wireframe.css` | 当前低保真灰度覆盖层及寄出音信页面样式 |

### 当前线框版本怎么改

优先只修改：

```text
src/styles/wireframe.css
```

这样不会影响业务逻辑、路由和 mock API。

### 恢复原高保真版本

在 `src/main.tsx` 中暂时移除或注释：

```ts
import './styles/wireframe.css';
```

页面将回到 `tokens.css + base.css + yinxin.css` 定义的高保真视觉。

## 8. 常见视觉修改

### 修改颜色

当前线框色彩变量定义在 `wireframe.css` 顶部：

```css
:root {
  --bg: #fff;
  --surface: #f4f4f4;
  --line: #b9b9b9;
  --text: #202020;
  --muted: #6f6f6f;
}
```

建议所有新颜色先定义为变量，再在组件样式中引用。

### 修改字体

修改 `wireframe.css` 中的 `:root`：

```css
font-family: Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
```

### 修改手机容器

基础手机壳位于：

```text
src/styles/base.css
```

核心选择器：

```css
.phone-shell
```

当前业务页最大宽度为 `390px`。桌面浏览器会居中显示手机容器，移动端使用全宽。

“我寄出的音信”列表和详情始终使用手机版单列结构，即使在桌面端也不会切换成双栏。

### 修改卡片和列表密度

常用选择器：

```css
.candidate-card            /* 候选音信 */
.music-letter              /* 音信音乐卡片 */
.sent-list-card            /* 寄出音信列表项 */
.sent-detail-letter        /* 寄出音信详情 */
.sent-reply-item           /* 回复卡片 */
.reply-types               /* 回复方式选择 */
```

### 修改按钮

全局按钮：

```css
.primary-button
.secondary-button
.text-button
```

页面中的业务按钮尽量复用这三个类，不要在页面组件里写内联颜色、阴影和圆角。

### 修改装入信封动画

相关样式位于：

```css
.packing-scene
.packing-card
.envelope-back
.envelope-front
@keyframes card-pack
```

动画时长变量为：

```css
--duration-pack
```

## 9. 图片和图标占位

当前线框版本要求：

- 图片位置显示 `图片占位`
- 图标位置显示 `图标占位`

图片占位组件：

```text
src/components/yinxin/CoverArt.tsx
```

线框模式还会在 `wireframe.css` 中隐藏 Lucide SVG，并通过伪元素显示 `图标占位`。

### 接入真实图片

1. 修改 `CoverArt.tsx`，将占位 `div` 替换为 `img`。
2. 给图片设置明确的 `alt`。
3. 在 `wireframe.css` 中移除或覆盖 `.cover-art` 的占位样式。
4. 将资源放入 `public/assets/`，使用 `/assets/文件名` 引用。

### 恢复真实图标

组件中已经保留 `lucide-react` 图标。移除 `wireframe.css` 中以下规则即可重新显示：

```css
svg { display: none !important; }
```

同时删除生成 `图标占位` 的 `:has(> svg)::before` 相关规则。

## 10. 修改页面内容

### 页面文案和结构

对应页面位于：

```text
src/app/routes/
```

修改文案、区块顺序或页面专属操作时，编辑对应的 `*Page.tsx`。

### 候选歌曲和歌词

```text
src/data/mockCandidates.ts
```

可修改歌曲名、歌手、歌词片段、推荐理由和默认卡片附言。

### 生成延迟与异常状态

```text
src/services/yinxinApi.ts
```

生成接口支持：

- `success`：正常返回候选
- `error`：模拟生成失败
- `empty`：模拟无候选结果

### 分享卡片和回复数据

```text
src/services/shareStore.ts
```

本地存储键：

```text
yinxin.cards.v1
yinxin.replies.v1
```

如果修改数据结构后页面仍显示旧数据，可在浏览器控制台执行：

```js
localStorage.removeItem('yinxin.cards.v1');
localStorage.removeItem('yinxin.replies.v1');
location.reload();
```

## 11. 修改视觉时的推荐流程

1. 执行 `npm run start`。
2. 优先修改 `src/styles/wireframe.css`。
3. 在浏览器中检查首页、创建、候选、编辑、分享、接收和寄出详情。
4. 分别检查约 `390 × 844` 的移动视口和桌面居中手机壳。
5. 运行测试和构建：

```bash
npm test
npm run typecheck
npm run build
```

6. 提交前确认没有修改 `node_modules/`、`dist/` 和 `*.tsbuildinfo`。

## 12. 常见问题

### 页面白屏

不要使用 `file://` 直接运行应用。执行：

```bash
npm run start
```

### 修改样式没有生效

1. 确认修改的是最后加载的 `wireframe.css`。
2. 检查是否被 `!important` 规则覆盖。
3. 强制刷新浏览器。
4. 查看 Vite 终端是否存在 CSS 语法错误。

### 端口被占用

关闭已有开发服务，或执行：

```bash
npx vite --host 127.0.0.1 --port 5174
```

### 寄出列表出现之前测试的数据

这是 localStorage 中保存的演示数据。按第 10 节方式清理本地存储即可。

### 构建失败

依次执行：

```bash
npm install
npm run typecheck
npm test
npm run build
```

根据第一条失败命令修复类型、测试或依赖问题。
