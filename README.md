# Axis of Time: The Coordinates of Civilization (时间轴：文明的坐标)

<!-- 可选：在此处放置一张吸引人的项目截图或 GIF 动图 -->
<!-- [项目截图/GIF，例如：![项目截图](link_to_image.png)] -->

---
**English Summary:** Axis of Time is an interactive timeline visualization tool for historical events, powered by AI (Google Gemini / OpenAI compatible models) for generating event summaries, enabling Q&A, and dynamically creating new events based on user prompts. Key features include intuitive zooming and panning controls, dual tracks for Chinese and World history, customizable themes (Starmap and Ancient Scroll), user-configurable AI providers, and the ability to add, edit, and manage custom historical events. All user settings and custom data are stored locally in the browser. (A full English README is planned for the future).

---

一款交互式历史时间轴可视化工具，结合 AI 技术，带您穿越古今，探索中华与世界文明的璀璨节点。

## ✨ 核心功能

*   **交互式时间轴：** 通过鼠标滚轮缩放，拖拽平移，自由探索广阔的时间维度。
*   **双轨历史呈现：** 清晰展示“中国”与“世界”历史发展脉络。
*   **事件详情卡片：** 点击事件节点，获取中英文标题、年份、相关历史标签。
*   **AI 助力探索：**
    *   **智能摘要：** AI 自动生成事件的精炼摘要。
    *   **图片联想：** AI 提供事件相关的图片搜索关键词，辅助视觉呈现 (图片来自 Unsplash)。
    *   **深度问答：** 就当前事件向 AI 提问，获取更深入的解答。
    *   **AI 搜索与生成：** 输入关键词（如“唐朝科技”），AI 可从网络信息中查找并生成新的相关历史事件，动态丰富时间轴内容。
*   **高度自定义：**
    *   **多语言支持：** 中文、英文界面一键切换。
    *   **个性化主题：** “星图”与“古卷”两种视觉主题，多种背景、时间轴及图钉样式可选。
    *   **AI 提供商管理：** 支持配置和切换不同的 AI 模型服务商 (Google Gemini 及兼容 OpenAI 的 API)。
    *   **自定义事件：** 用户可手动添加、编辑、删除个人关注的历史事件，或使用 AI 批量生成。
*   **数据本地存储：** 您的个性化设置、自定义事件和 AI 配置将安全存储在浏览器本地 (LocalStorage)。

## 🛠️ 技术栈

*   **前端：** React 19, TypeScript, Vite
*   **UI：** Tailwind CSS
*   **状态管理：** React Context API
*   **AI 集成：** Google Gemini API / 兼容 OpenAI 的 API (通过 `@google/genai` SDK 或 `fetch` 实现)
*   **数据存储：** 浏览器 LocalStorage
*   **国际化：** 自定义 i18n 方案 (`src/translation.ts`)
*   **唯一ID：** `uuid`

## 🚀 快速开始 (面向用户)

### 1. 在线访问 (推荐)

您可以直接访问项目部署的在线版本：

[➡️ 点击这里，开始探索！](https://quasar2333.github.io/Axis-of-Time-The-Coordinates-of-Civilization/)

**请注意：**
*   为了获得最佳体验，请使用最新版本的现代桌面浏览器，如 Chrome, Firefox, Safari, 或 Edge。
*   AI 功能（如事件摘要、AI 问答、AI 搜索）需要您的浏览器能够连接到 AI 服务提供商的 API 地址。默认情况下，这通常是 Google API (`*.googleapis.com`)。如果您在应用内配置了其他 AI 服务商，请确保网络通畅。

### 2. 本地运行

如果您希望在本地计算机上运行本项目，例如进行二次开发或在无法访问公网 AI 服务时使用自定义的本地 AI 模型（需自行配置代理或兼容 API），请按以下步骤操作：

**环境要求：**

*   **Node.js:** 建议安装最新的长期支持版本 (LTS)，例如 v18.x 或 v20.x。您可以从 [Node.js 官方网站](https://nodejs.org/) 下载并安装。
*   **npm 或 yarn:**
    *   npm 通常随 Node.js 一同安装。
    *   yarn 是另一个流行的 JavaScript 包管理工具，您可以从 [Yarn 官方网站](https://yarnpkg.com/) 安装。

**步骤详解：**

1.  **克隆仓库：**
    打开您的终端或命令行工具，执行以下命令将项目代码克隆到本地：
    ```bash
    git clone https://github.com/quasar2333/Axis-of-Time-The-Coordinates-of-Civilization.git
    ```
    然后进入项目目录：
    ```bash
    cd Axis-of-Time-The-Coordinates-of-Civilization
    ```

2.  **安装依赖：**
    在项目根目录下，执行以下命令安装项目所需的所有依赖库：
    使用 npm:
    ```bash
    npm install
    ```
    或者使用 yarn:
    ```bash
    yarn install
    ```
    此过程可能需要几分钟时间，具体取决于您的网络速度。

3.  **配置 API Key (重要！)：**
    本项目的 AI 功能依赖于 AI 服务提供商的 API Key。
    *   在项目根目录下，**复制 `.env.example` 文件 (如果存在) 并将其重命名为 `.env`**。如果项目中没有 `.env.example`，请手动创建一个新文件并命名为 `.env`。
        建议的 `.env.example` 内容如下，您可以先创建此文件：
        ```env
        # .env.example
        # Copy this file to .env and fill in your API key for the default Gemini provider
        GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```
    *   **获取 API Key：**
        *   **Google Gemini (默认):** 前往 [Google AI Studio](https://aistudio.google.com/app/apikey) 创建并获取您的 API Key。
        *   **其他兼容 OpenAI 的服务:** 如果您计划使用其他 AI 服务 (如本地部署的模型或第三方提供的兼容 OpenAI 接口的服务)，请从相应服务商处获取 API Key 和服务的基础 URL (Base URL)。
    *   **编辑 `.env` 文件：**
        打开 `.env` 文件，填入您的 API Key。对于默认的 Google Gemini，它应该如下所示：
        ```env
        GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY
        ```
        将其中的 `YOUR_ACTUAL_GEMINI_API_KEY` 替换为您真实的 Google Gemini API Key。
    *   **说明：**
        *   `.env` 文件中配置的 `GEMINI_API_KEY` 主要用作应用启动时默认 AI 提供商的密钥。
        *   您可以在应用运行后，通过界面右上角的“设置” -> “AI 设置”来添加和管理多个 AI 提供商，并为每个提供商单独配置 API Key 和其他参数。即使 `.env` 文件中的 `GEMINI_API_KEY` 未设置或无效，只要您在应用内正确配置并激活了至少一个有效的 AI 提供商，AI 功能依然可以使用。

4.  **启动开发服务器：**
    一切准备就绪后，执行以下命令启动本地开发服务器：
    使用 npm:
    ```bash
    npm run dev
    ```
    或者使用 yarn:
    ```bash
    yarn dev
    ```
    该命令会启动一个本地 Web 服务器，并监听一个端口 (通常 Vite 会自动选择一个可用端口，如 `5173`)。终端会显示访问地址。

5.  **访问应用：**
    打开您的网络浏览器 (推荐 Chrome, Firefox)，在地址栏输入终端提示的本地访问地址，例如 `http://localhost:5173`。您现在应该可以看到应用的界面了。

### 3. 如何使用

欢迎来到“时间轴：文明的坐标”！以下是如何玩转这个应用：

*   **界面概览：**
    *   **时间轴主体：** 屏幕中央是可交互的时间轴，历史事件以图钉的形式标记在上下两条轨道上。上方轨道通常代表“中国”历史，下方代表“世界”历史。
    *   **顶部控制面板：**
        *   **搜索框 (左侧)：** 您可以在这里输入关键词搜索已存在的历史事件（按标题、年份、标签搜索），或者尝试使用 AI 根据您的输入（如“古希腊哲学”）生成新的相关事件。
        *   **当前年份 (中间，较大屏幕可见)：** 显示时间轴视图中心点所对应的年份。
        *   **设置按钮 (右侧，齿轮图标)：** 点击这里可以打开设置面板，进行个性化配置。
    *   **底部提示文字：** 简要说明时间轴的基本交互方式（滚轮缩放，拖拽平移）。

*   **时间轴交互：**
    *   **缩放 (Zoom)：** 将鼠标指针悬停在时间轴区域，向前滚动鼠标滚轮可以放大时间轴，看到更短时间跨度内的更多细节（时间粒度变细）；向后滚动则缩小时间轴，观察更长远的历史时期（时间跨度变大）。缩放会以鼠标指针当前位置为中心进行。
    *   **平移 (Pan)：** 在时间轴区域按住鼠标左键不放，然后拖动鼠标即可左右平移时间轴，浏览不同的历史时期。

*   **查看事件详情：**
    *   当您对时间轴上的某个事件感兴趣时，**单击该事件的图钉节点**。
    *   一个**信息卡片 (InfoCard)** 将会弹出，展示该事件的详细信息：
        *   中英文标题和发生年份。
        *   相关的历史标签。
        *   **AI 生成的摘要：** 一段由 AI 自动生成的关于此事件的简明扼要的介绍 (需要正确配置并联网 AI 服务)。
        *   **相关图片：** 如果 AI 能够根据事件内容生成有效的图片搜索关键词，这里会尝试从 Unsplash 加载一张相关图片作为视觉参考 (同样需要 AI 服务和网络)。
        *   **外部链接：** 提供快速跳转到维基百科 (Wikipedia) 和百度百科对应词条的链接，方便您查阅更详尽的资料。
        *   **AI 互动聊天：** 卡片底部是一个聊天窗口，您可以就当前事件向 AI 提问，进行更深入的探讨。

*   **AI 功能详解：**
    *   **AI 摘要与图片：** 在您打开事件信息卡片时，应用会自动请求 AI 服务生成摘要和图片关键词。如果网络或 API Key 配置有问题，相应区域会显示提示信息。
    *   **AI 问答 (InfoCard 内)：**
        *   在信息卡片的聊天区域，您可以直接输入您想问的关于此事件的问题，然后按回车或点击发送按钮。
        *   AI 会根据其知识库和当前事件的上下文给出回答。
        *   您可以进行多轮对话。
    *   **AI 搜索与事件生成 (顶部搜索框)：**
        *   在顶部的搜索框输入您感兴趣的历史主题、时期或关键词，例如“文艺复兴时期的艺术家”或“中国古代四大发明”。
        *   应用会首先在已有的事件库中进行搜索。
        *   如果本地搜索结果较少或没有，并且您的输入长度足够，搜索结果列表下方会出现一个带有 ✨ 图标的选项，提示“使用 AI 搜索 "[您的关键词]"”。
        *   点击此选项，应用会将您的关键词发送给 AI，AI 会尝试根据网络信息查找或生成一系列相关的历史事件，并将它们作为新的“自定义事件”添加到您的时间轴中。这些新生成的事件会立即显示在时间轴上（如果它们的年份在当前可见范围内），并且您可以在“设置”->“我的事件”中管理它们。

*   **设置选项 (通过右上角齿轮图标进入)：**
    点击界面右上角的齿轮图标，可以打开设置面板，进行多项个性化配置：
    *   **外观 (Appearance)：**
        *   **主题 (Theme)：** 在具有科技感的“星图 (Starmap)”和古朴典雅的“古卷 (Ancient Scroll)”两种视觉主题之间切换。
        *   **背景 (Background)：** 选择您喜欢的背景样式，如深蓝、深空、羊皮纸或浅色背景。
        *   **时间轴样式 (Timeline Style)：** 设置时间轴中心线为连续的“实线 (Line)”或间断的“虚线 (Dotted)”。
        *   **图钉样式 (Pin Style)：** 更改时间轴上事件节点的图钉显示样式，可选“图钉 (Pin)”、“辉光 (Glow)”或“圆环 (Ring)”。
    *   **语言 (Language)：**
        *   在“English”和“中文 (Chinese)”之间切换整个应用界面的显示语言。
    *   **AI 设置 (AI Settings)：**
        *   **当前 AI 提供商 (Active AI Provider)：** 从您已添加的 AI 提供商列表中选择一个当前要使用的。
        *   **管理 AI 提供商：**
            *   **添加 (Add AI Provider)：** 您可以添加多个 AI 服务配置。点击“添加提供商”按钮，然后填写：
                *   **提供商名称 (Provider Name)：** 给这个配置起一个易于识别的名字 (例如 "My Local LLM" 或 "OpenAI GPT-4")。
                *   **模型 ID (Model ID)：** 填写您要使用的具体模型名称 (例如 Google Gemini 的 `gemini-1.5-flash-latest` 或 OpenAI 的 `gpt-3.5-turbo`)。
                *   **API Key：** 填入该服务商提供给您的 API 密钥。
                *   **Base URL (可选)：** 对于兼容 OpenAI API 格式的服务 (例如一些本地部署的模型或第三方代理服务)，您需要在此处填写其基础 URL (例如 `http://localhost:1234/v1` 或 `https://api.example.com/v1`)。对于 Google Gemini，此项通常留空。
            *   **编辑 (Edit)：** 修改已添加的 AI 提供商的配置。
            *   **删除 (Delete)：** 移除不再需要的 AI 提供商配置 (默认的 "Google Gemini Flash" 不可删除，但可以修改其 API Key)。
    *   **我的事件 (My Events)：**
        *   **管理自定义事件列表：** 这里会列出所有由您手动添加或通过 AI 搜索生成的事件。
        *   **手动添加事件 (Add Manual Event)：** 点击“添加事件”按钮，可以手动创建一个新的历史事件。您需要填写：
            *   标题 (英文)
            *   标题 (中文)
            *   年份 (Year): 公元前请使用负数 (例如 -221 代表公元前221年)。
            *   轨道 (Track): 选择“中国 (China)”或“世界 (World)”。
            *   标签 (Tags): 输入与事件相关的关键词，用逗号分隔 (例如 "科技, 发明, 古代")。
        *   **编辑事件 (Edit Event)：** 点击列表中事件旁边的编辑图标，可以修改该事件的各项信息。
        *   **删除事件 (Delete Event)：** 点击删除图标移除事件。
        *   **使用 AI 生成事件 (Generate with AI)：**
            *   在“使用AI生成”区域的输入框中，输入一个您感兴趣的历史主题或提示词 (例如，“探索古罗马的著名战役”或“明朝科技成就”)。
            *   点击“使用AI生成”按钮。应用会将您的提示发送给当前激活的 AI 提供商。
            *   AI 会尝试根据您的提示生成一系列相关的历史事件，这些事件会自动添加到下方的自定义事件列表中。
            *   如果 AI 服务配置不正确或网络问题，可能会提示错误。

### 4. 打包程序 (面向开发者/高级用户)

如果您是开发者，或者希望将此应用部署到您自己的服务器上，可以按照以下步骤构建项目的静态文件：

1.  **确保已完成本地运行的步骤 1 和 2 (克隆仓库并安装依赖)。**

2.  **执行构建命令：**
    在项目根目录下，打开终端并运行：
    使用 npm:
    ```bash
    npm run build
    ```
    或者使用 yarn:
    ```bash
    yarn build
    ```
    此命令会使用 Vite 将项目代码 (TypeScript, React, CSS 等) 编译、优化并打包成一组静态文件。

3.  **获取构建产物：**
    构建成功后，所有用于部署的静态文件都会被放置在项目根目录下的 `dist` 文件夹中。这个文件夹通常包含 `index.html`、以及一些被哈希命名的 JavaScript 和 CSS 文件。

4.  **部署 `dist` 目录：**
    您可以将 `dist` 文件夹的**全部内容**上传并部署到任何支持静态文件托管的 Web 服务器或平台，例如：
    *   **GitHub Pages:** 非常适合开源项目，可以将 `dist` 目录的内容推送到 `gh-pages` 分支或从特定目录部署。本项目已通过此方式部署。
    *   **Vercel, Netlify:** 这些平台提供了便捷的 Git 集成和自动部署功能。
    *   **传统的 Web 服务器:** 如 Nginx, Apache。您需要配置服务器以正确提供这些静态文件。
    *   **对象存储服务:** 如 AWS S3, Google Cloud Storage, Azure Blob Storage，配置为静态网站托管模式。

    **重要配置 (对于单页面应用 SPA)：**
    由于这是一个单页面应用 (SPA)，在部署到某些服务器 (如 Nginx 或 Apache) 时，您可能需要配置 URL 重写规则，确保所有未直接匹配到静态文件的请求都回退 (fallback) 到 `index.html`。这能保证在用户直接访问应用的深层链接 (例如 `https://yourdomain.com/some/path`) 或刷新页面时，应用能正确加载而不是返回 404 错误。
    *   **Nginx 示例配置片段：**
        ```nginx
        location / {
          try_files $uri $uri/ /index.html;
        }
        ```
    *   对于 GitHub Pages, Vercel, Netlify 等现代化托管平台，通常会自动处理 SPA 的路由问题，无需额外配置。

## 👨‍💻 面向开发者

本部分旨在为希望理解项目内部工作原理、进行二次开发或贡献代码的开发者提供指引。

### 1. 项目架构与原理

#### 核心概念

*   **时间轴 (`Timeline`)：** 应用的核心可视化界面，位于 `src/components/Timeline.tsx`。它负责渲染历史事件节点和时间刻度，并响应用户的缩放和平移操作。其行为由 `src/hooks/useTimeline.ts` Hook驱动。
*   **历史事件 (`HistoricalEvent`)：** 在 `src/types.ts` 中定义。每个事件对象包含年份 (`year`)、中英文标题 (`title`, `title_zh`)、所属轨道 (`track`: 'China' | 'World')、标签 (`tags` 数组) 以及一个可选的 `isCustom` 标记（用于区分内置事件和用户添加的事件）。AI 生成的内容（摘要 `summary`）在获取后可能会动态添加到事件对象上或存储在缓存中。
*   **缩放级别 (`TimelineScale`)：** 在 `src/constants.ts` 中的 `SCALES` 数组定义。每个 `TimelineScale` 对象描述了一个特定的缩放级别，包括该级别下每1000像素代表的年数 (`yearsPer1000Px`)、该级别的名称 (如 'Modern Era') 以及适用的最小/最大年份。`useTimeline` Hook 会根据当前 `zoomLevel` 选择合适的 `TimelineScale`。
*   **AI 集成 (`services/gemini.ts`)：** 项目通过 `src/services/gemini.ts` 模块与外部 AI 服务进行交互。该模块封装了对 Google Gemini API 和兼容 OpenAI API 的调用逻辑，用于获取事件摘要、生成图片搜索关键词、提供 AI 问答以及根据用户提示生成新的历史事件。

#### 数据流

1.  **事件数据源：**
    *   **内置事件：** 静态定义在 `src/constants.ts` 的 `EVENTS` 数组中，作为应用的基础历史数据。
    *   **自定义事件：** 用户通过“设置”面板手动添加或由 AI 搜索功能生成的事件。这些事件存储在浏览器的 LocalStorage 中，并通过 `AppContext` 加载和管理。
    *   **`allEvents`：** 在 `AppContext` 中，内置事件和自定义事件会合并、去重（AI生成时会做标题检查以避免与现有事件重复）并按年份排序，形成 `allEvents` 数组，供时间轴等组件使用。

2.  **状态管理 (`AppContext`)：**
    *   `src/AppContext.tsx` 是项目的全局状态管理中心，基于 React Context API 实现。
    *   它维护了如当前语言 (`language`)、主题设置 (`settings`)、AI 提供商配置 (`aiProviders`, `activeAIProviderId`)、自定义事件列表 (`customEvents`)、合并后的所有事件 (`allEvents`) 以及 AI 生成的事件详情缓存 (`eventDetailsCache`) 等核心状态。
    *   组件通过 `useAppContext()` Hook 来消费这些全局状态和调用相关的更新方法 (如 `updateSettings`, `addCustomEvent` 等)。
    *   大部分状态（设置、AI 提供商、自定义事件）都通过 `useLocalStorage` 自定义 Hook 实现了持久化存储。

3.  **用户交互与视图更新：**
    *   **时间轴交互：**
        *   用户在 `Timeline` 组件上进行的操作（鼠标滚轮缩放、拖拽平移）由 `src/hooks/useTimeline.ts` Hook 内部处理。
        *   `useTimeline` Hook 维护着时间轴的当前视口状态，主要是 `centerYear` (时间轴中心点代表的年份) 和 `zoomLevel` (当前的缩放级别，对应 `SCALES` 数组的索引)。
        *   当这些状态改变时，`useTimeline` 会导出一系列更新后的值 (如新的 `centerYear`、`scale` 对象、`visibleYearRange` 以及转换函数 `yearToPx`)。
        *   `Timeline` 组件作为 `useTimeline` Hook 的消费者，在这些值更新时会重新渲染，进而重新计算和渲染其子组件 `EventNode` 的位置和时间轴刻度。
    *   **其他交互：**
        *   用户点击事件节点 (`EventNode`) 时，会触发回调将该事件设为 `Timeline` 组件的 `selectedEvent` 状态，从而显示 `InfoCard`。
        *   用户在 `Settings` 面板或 `Search` 组件中进行的操作（如更改设置、添加自定义事件、触发 AI 搜索）会调用 `AppContext` 中提供的相应方法来更新全局状态。
        *   全局状态的更新会通过 React 的上下文机制传递给所有订阅了该上下文的组件，触发相关组件的重新渲染，从而实现界面的动态更新。

#### 关键组件详解

*   **`src/components/Timeline.tsx`：**
    *   使用 `useTimeline` Hook 获取时间轴的当前状态和交互逻辑。
    *   根据 `visibleYearRange` (由 `useTimeline` 提供) 和 `allEvents` (来自 `AppContext`) 过滤出当前视口内可见的事件。
    *   为每个可见事件渲染一个 `EventNode` 组件，并传递计算好的位置 (`yearToPx(event.year)`) 和其他必要 props。
    *   动态渲染时间轴的年份刻度标记。
    *   管理 `selectedEvent` 状态，用于控制 `InfoCard` 的显示和内容。

*   **`src/components/EventNode.tsx`：**
    *   接收一个 `HistoricalEvent` 对象作为 prop，并根据其 `year` 和 `track` 属性以及 `useTimeline` 提供的 `yearToPx` 函数来确定自身在时间轴上的精确位置。
    *   其视觉表现（如图钉样式、连接线方向、是否显示事件标题和图片）会根据全局 `settings` (来自 `AppContext`)、当前的 `zoomLevel` 以及事件本身的属性动态调整。
    *   当 `zoomLevel` 达到 `ZOOM_THRESHOLD_FOR_IMAGE` 时，它会尝试调用 `AppContext` 中的 `fetchAndCacheEventDetails` 方法来获取该事件的 AI 生成详情（特别是 `image_query`），然后使用该查询词从 Unsplash 加载一张相关图片。这个获取过程是异步的，并有加载和错误状态处理。

*   **`src/components/InfoCard.tsx`：**
    *   当用户点击一个 `EventNode` 时，此组件会以模态框的形式弹出，显示该事件的详细信息。
    *   **`AIGeneratedContent` (子组件)：** 负责异步获取并展示 AI 生成的事件摘要和相关图片。它会调用 `fetchEventDetails` (在 `services/gemini.ts` 中，最终通过 `AppContext` 的 `fetchAndCacheEventDetails` 来利用缓存)，并处理加载状态、错误状态（如 API Key 未设置或网络问题）以及重试逻辑。
    *   **`Chat.tsx` (子组件)：** 为当前显示的事件提供一个 AI 聊天界面。用户输入问题后，`Chat.tsx` 会调用 `getAiChatResponse` (在 `services/gemini.ts`) 来获取 AI 的回答，并管理聊天历史。

*   **`src/services/gemini.ts`：**
    *   这是与所有 AI 后端服务通信的中央枢纽。
    *   **`fetchEventDetails(title, lang, provider, signal)`：** 根据事件标题、语言和选定的 `AIProvider` 配置，构造合适的 prompt，调用 AI 服务（Google Gemini 或兼容 OpenAI 的 API）获取事件的摘要 (`summary`) 和图片搜索关键词 (`image_query`)。对于 Google Gemini，它还会尝试提取 API 返回的搜索引用来源 (`sources`)。
    *   **`getAiChatResponse(eventTitle, history, newMessage, lang, provider)`：** 根据当前事件标题、聊天历史、用户新消息、语言和 `AIProvider` 配置，调用 AI 服务进行对话式问答。对于 Google Gemini，它会尝试维护一个连续的 `Chat` 会话实例以支持上下文。
    *   **`generateEventsFromPrompt(userPrompt, lang, provider)`：** 根据用户提供的自然语言提示（例如来自搜索框的 AI 搜索请求或“我的事件”中的批量生成请求）、语言和 `AIProvider` 配置，调用 AI 服务生成一个包含多个 `HistoricalEvent` 对象的数组。AI 被指示要确保事实准确性（理论上通过其内部的搜索或知识库）并按指定 JSON 格式返回。
    *   **API 适配：** 该模块通过检查 `AIProvider` 对象中是否存在 `baseUrl` 字段来区分是应调用 Google Gemini 的原生接口（如果 `baseUrl` 为空或未定义）还是兼容 OpenAI 的 API 接口（如果 `baseUrl`存在）。
    *   **JSON 清理：** 包含 `cleanAndParseJson` 工具函数，用于处理 AI API 可能返回的被 Markdown 代码块 (```json ... ```) 包裹的 JSON 字符串，提取出纯净的 JSON 内容进行解析。

*   **`src/hooks/useTimeline.ts`：**
    *   这是实现交互式时间轴的核心自定义 Hook。它封装了以下复杂逻辑：
        *   **状态管理：** 维护 `centerYear` (时间轴中心点代表的年份) 和 `zoomLevel` (当前缩放级别，是 `SCALES` 数组的索引)。
        *   **坐标转换：** 提供 `yearToPx(year)` 函数将年份转换为相对于时间轴容器的像素位置，以及 `pxToYear(px)` 函数进行反向转换。这些转换依赖于当前 `zoomLevel` 对应的 `scale.yearsPer1000Px` 和时间轴容器的宽度。
        *   **缩放逻辑 (`handleWheel`)：** 响应鼠标滚轮事件，调整 `zoomLevel`。关键在于它实现了“向鼠标指针位置缩放”的效果：在改变 `zoomLevel` 后，它会重新计算 `centerYear`，以确保鼠标指针下的那个年份在缩放后仍然停留在鼠标指针下方，从而提供自然的缩放体验。
        *   **平移逻辑 (`handleMouseDown`, `handleMouseMove`, `handleMouseUp`, `handleMouseLeave`)：** 响应鼠标拖拽事件，通过记录鼠标位移并将其转换为年份变化来更新 `centerYear`，实现时间轴的平滑拖动。
        *   **视口计算：** 根据当前的 `centerYear`、`zoomLevel` 和容器宽度，计算出 `visibleYearRange` (一个包含 `start` 和 `end` 年份的对象)，供 `Timeline` 组件用来过滤需要渲染的事件和刻度。
        *   **编程控制：** 提供 `setTimelineView({ year, zoom })` 方法，允许外部组件（如搜索结果选择后）以编程方式直接设置时间轴的中心年份和缩放级别。

*   **`src/AppContext.tsx`：**
    *   除了之前提到的状态管理和持久化，它还通过 `fetchAndCacheEventDetails` 方法提供了一个带缓存的事件详情获取机制。当 `EventNode` 或 `InfoCard` 需要事件的 AI 生成详情时，会调用此方法。该方法首先检查 `eventDetailsCache` (一个 `Map` 对象) 中是否已存在该事件的详情，如果存在则直接返回缓存数据，否则才调用 `services/gemini.ts` 中的 `fetchEventDetails` 从 AI API 获取，并将结果存入缓存后再返回。这可以有效减少对 AI API 的重复请求，节省资源并提高响应速度。

#### AI 集成原理

*   **API Key 管理与使用：**
    *   应用启动时，会尝试从 `.env` 文件加载 `GEMINI_API_KEY` (通过 Vite 的 `define` 机制注入到客户端代码中，表现为 `process.env.GEMINI_API_KEY`)，作为默认 Google Gemini 提供商的初始 API Key。
    *   用户可以在“设置”->“AI 设置”中为每个 AI 提供商（包括默认的）配置或更新 API Key。这些用户配置的 Key 存储在 LocalStorage 中，并优先于 `.env` 文件中的值。
    *   当 `services/gemini.ts` 中的函数被调用时，它会接收一个 `AIProvider` 对象作为参数，该对象包含了当前操作应使用的 API Key、模型 ID 和可选的 Base URL。

*   **服务调用流程：**
    1.  **请求发起：** 应用中的组件（如 `InfoCard`, `Search`, `Settings`）通过调用 `AppContext` 中的方法或直接调用 `services/gemini.ts` 中的导出函数来触发 AI 操作。
    2.  **参数准备：** 调用时会传递必要的参数，如事件标题、用户输入、聊天历史、当前语言设置，以及从 `AppContext` 获取的当前激活的 `AIProvider` 对象。
    3.  **API 适配与执行 (`services/gemini.ts`)：**
        *   根据 `AIProvider.baseUrl` 是否存在，决定是构建 Google Gemini API 请求还是兼容 OpenAI API 的请求。
        *   构造符合相应 API 规范的请求体 (payload)，包括 prompt、模型名称、历史消息（对于聊天）、以及可能的 JSON 模式指示（虽然代码中移除了显式的 `response_format`，但 prompt 本身会强烈暗示 AI 返回 JSON）。
        *   使用 `fetch` API 发送 HTTP POST 请求到目标 API 端点。
        *   对于需要工具调用（如Google Search）的 Gemini 请求，会在配置中指定。
    4.  **响应处理：**
        *   获取 API 返回的响应数据（通常是 JSON 格式的文本）。
        *   调用 `cleanAndParseJson` 清理并解析 JSON 字符串。
        *   根据操作类型（获取详情、聊天、生成事件）提取所需的数据字段。
    5.  **数据返回与界面更新：**
        *   处理后的数据返回给调用方。
        *   如果操作涉及到状态更新（如添加新生成的事件、更新聊天历史、填充事件摘要），则会通过 `AppContext` 的方法更新全局状态，进而触发界面重新渲染。

### 2. 代码结构

```
.
├── public/                   # 静态资源 (如 vite.svg)
├── src/
│   ├── components/           # React 组件 (UI表现层)
│   │   ├── EventNode.tsx     # 单个时间轴事件节点
│   │   ├── icons.tsx         # SVG 图标集合
│   │   ├── InfoCard.tsx      # 事件详情弹窗卡片
│   │   ├── Search.tsx        # 顶部搜索框
│   │   └── Timeline.tsx      # 时间轴主体组件
│   ├── hooks/                # 自定义 React Hooks (逻辑复用)
│   │   └── useTimeline.ts    # 时间轴交互核心逻辑
│   ├── services/             # 外部服务交互 (如 AI API)
│   │   └── gemini.ts         # 与 Google Gemini 及兼容 OpenAI API 的通信
│   ├── App.tsx               # 主应用根组件 (布局)
│   ├── AppContext.tsx        # 全局状态管理 (React Context)
│   ├── Chat.tsx              # AI 聊天界面组件 (嵌入 InfoCard)
│   ├── constants.ts          # 应用级常量 (预定义事件数据, 时间轴刻度配置)
│   ├── index.tsx             # React 应用的 DOM 入口点
│   ├── Settings.tsx          # 设置面板组件 (多标签页配置)
│   ├── translation.ts        # 国际化 (i18n) 文本及逻辑
│   ├── types.ts              # TypeScript 全局类型定义
│   └── vite-env.d.ts         # Vite 注入的环境变量类型声明
├── .env.example              # 环境变量配置文件示例 (指导用户创建 .env)
├── .eslintrc.cjs             # ESLint 配置文件 (代码规范检查)
├── .gitignore                # Git 版本控制忽略规则
├── index.html                # 单页面应用的 HTML 入口文件
├── LICENSE                   # 项目许可证文件 (当前采用 MIT)
├── package.json              # npm 包管理文件 (项目依赖, 脚本命令)
├── README.md                 # 本 README 文件
├── tsconfig.json             # TypeScript 编译器配置文件 (项目级)
├── tsconfig.node.json        # TypeScript 编译器配置文件 (Node.js 环境, 如 Vite 配置)
└── vite.config.ts            # Vite 构建工具配置文件
```
*(注：`ThemeToggle.tsx` 在分析中被认为可能已废弃或未完全使用，因此未列入此关键结构。项目主要依赖 Tailwind CSS 进行样式控制，独立的 `.css` 文件若存在，其重要性相对较低。)*

### 3. 如何贡献

我们热烈欢迎并感谢所有形式的社区贡献，无论是新功能建议、Bug 修复、文档改进还是代码优化！

1.  **Fork 本仓库：** 点击项目 GitHub 页面右上角的 "Fork" 按钮，将仓库复制到您自己的 GitHub 账户下。
2.  **克隆您的 Fork：** 将您 Fork 后的仓库克隆到本地计算机：
    ```bash
    git clone https://github.com/YOUR_USERNAME/Axis-of-Time-The-Coordinates-of-Civilization.git
    cd Axis-of-Time-The-Coordinates-of-Civilization
    ```
    (请将 `YOUR_USERNAME` 替换为您的 GitHub 用户名)
3.  **创建特性分支：** 从 `main` (或当前开发主分支) 创建一个新的分支来进行您的修改。请为分支选择一个描述性的名称，例如：
    ```bash
    git checkout -b feat/add-event-sorting
    # 或者对于 Bug 修复:
    # git checkout -b fix/timeline-zoom-issue
    ```
4.  **进行修改：**
    *   根据您的想法或要修复的问题进行代码修改。
    *   请尽量遵循项目中已有的代码风格和编码约定。
    *   确保您的代码在 TypeScript 环境下类型正确，并利用好项目中已有的类型定义。
    *   如果添加新功能，请考虑其对现有功能的影响和可维护性。
    *   如有必要，更新相关的文档或注释。
5.  **代码规范与检查 (可选但推荐)：**
    如果项目配置了 ESLint 或 Prettier (本项目使用了 ESLint)，请在提交前运行检查和格式化命令：
    ```bash
    # 检查代码规范 (根据 package.json 可能为 lint 或 lint:fix)
    npm run lint
    ```
6.  **提交您的更改：**
    将您的修改提交到本地特性分支。请撰写清晰、简洁且具有描述性的 Commit Message。推荐遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。
    ```bash
    git add .
    git commit -m "feat: Implement advanced event sorting options in settings"
    ```
7.  **Push 到您的 Fork：**
    将您的本地特性分支推送到您在 GitHub 上的 Fork 仓库：
    ```bash
    git push origin feat/add-event-sorting
    ```
8.  **创建 Pull Request (PR)：**
    *   回到您在 GitHub 上的 Fork 仓库页面，您会看到一个提示可以为最近推送的分支创建一个 Pull Request。
    *   点击该提示，或手动导航到 "Pull requests" 标签页并点击 "New pull request"。
    *   确保基础分支是原始仓库的 `main` 分支，对比分支是您 Fork 仓库中的特性分支。
    *   在 PR 描述中，详细说明您的更改内容、目的、解决了什么问题，以及任何需要审查者特别注意的地方。如果相关，请链接到对应的 Issue。
    *   提交 Pull Request。

维护者将会审查您的 PR，可能会提出修改意见或直接合并。感谢您的贡献！

### 4. 本地开发

(详细的本地环境搭建和启动步骤已在前面的“面向用户”部分的“本地运行”小节中描述。开发者请务必仔细阅读并完成这些步骤，特别是关于 **Node.js 版本、依赖安装、以及 `.env` 文件配置 API Key** 的部分。)

**开发者特定注意事项：**

*   **API Key：** AI 功能是本项目的核心之一，确保您已正确配置至少一个有效的 AI Provider 及其 API Key，否则相关功能将无法正常工作。建议同时准备好 Google Gemini API Key 和一个兼容 OpenAI 的 API 服务（可以是 OpenAI 官方的，也可以是其他第三方或本地部署的）进行测试。
*   **Vite 开发服务器：** `npm run dev` (或 `yarn dev`) 启动的 Vite 开发服务器支持热模块替换 (HMR)，这意味着您在修改代码后，大部分情况下浏览器中的应用会自动更新，无需手动刷新，极大地提高了开发效率。
*   **浏览器开发者工具：**
    *   **控制台 (Console)：** 密切关注浏览器开发者工具的控制台输出，Vite 和应用本身可能会打印有用的调试信息或错误提示。
    *   **组件检查器 (Elements/Inspector)：** 用于检查渲染后的 DOM 结构和 CSS 样式。
    *   **React Developer Tools (浏览器扩展)：** 强烈建议安装此扩展。它可以帮助您检查 React 组件树、组件的 props 和 state，以及性能分析，是 React 开发的利器。
    *   **网络面板 (Network)：** 查看所有 HTTP 请求，特别是对 AI API 的请求，检查其请求体、响应体、状态码和耗时，有助于调试 AI 集成问题。
    *   **应用面板 (Application)：**
        *   **Local Storage：** 检查和管理应用存储在 LocalStorage 中的数据 (如设置、自定义事件、AI 提供商配置)。您可以手动修改或清除这些数据进行测试。
*   **TypeScript：** 项目使用 TypeScript，充分利用其类型检查功能可以在编码阶段发现许多潜在错误。留意 IDE (如 VS Code) 的 TypeScript 提示和错误。
*   **调试 `services/gemini.ts`：** 如果遇到 AI 功能不工作的问题，这个文件是首要的调试目标。您可以在其中添加 `console.log` 来打印请求的 prompt、API Key (注意不要意外提交含有真实密钥的代码)、API 返回的原始响应等，以帮助定位问题。
*   **Tailwind CSS：** 如果不熟悉 Tailwind CSS，可以查阅其[官方文档](https://tailwindcss.com/docs)。VS Code 等 IDE 通常有 Tailwind CSS 智能提示插件 (如 "Tailwind CSS IntelliSense")，可以提高开发效率。

## 💡 未来可能的改进方向

*   [ ] **更丰富的事件数据：** 引入更多内置历史事件，覆盖更广泛的领域和时期，或提供从外部数据源导入事件的功能。
*   [ ] **事件间关系可视化：** 例如，展示事件之间的因果关系、影响链接或同期发生的其他相关事件。
*   [ ] **用户账户系统：** (可选，会增加复杂度) 允许用户在线同步他们的自定义事件和设置。
*   [ ] **性能优化：** 对于非常大量级的事件数据（例如超过数千个事件），进一步优化时间轴的渲染性能和数据处理效率。
*   [ ] **单元测试与集成测试：** 为关键组件和核心逻辑（如 `useTimeline`, `services/gemini.ts`）编写测试用例，提高代码的健壮性和可维护性。
*   [ ] **更完善的主题自定义：** 允许用户通过调色板等方式更细致地调整主题颜色和字体选项。
*   [ ] **PWA (Progressive Web App) 支持：** 使应用具备更好的离线体验或添加到主屏幕的能力。
*   [ ] **辅助功能 (Accessibility, a11y)：** 进一步提升应用的可访问性，例如为时间轴元素提供更好的键盘导航和屏幕阅读器支持。
*   [ ] **导出/导入自定义数据：** 允许用户导出他们的自定义事件和AI设置，并在其他设备或浏览器上导入。

## 📜 许可证 (License)

本项目采用 **MIT License**。

```
MIT License

Copyright (c) 2024 quasar2333

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 致谢 (Acknowledgements) (可选)

*   感谢所有为本项目提供灵感和技术支持的开源社区。
*   特别感谢以下优秀的技术和项目：
    *   [React](https://react.dev/)
    *   [Vite](https://vitejs.dev/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Google Gemini](https://deepmind.google/technologies/gemini/)
    *   [Unsplash](https://unsplash.com/) (用于事件节点图片)

---

*README 由 AI 助手 (Jules) 协助分析项目并生成。*
