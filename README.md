# 时光之轴：文明坐标

这是一个交互式历史可视化应用的项目仓库，目标是构建双轨并行的历史时间轴，涵盖中国与世界的重要事件。

当前阶段：**Phase 1 - MVP 环境搭建与基础功能**。

项目目录和结构说明请参阅 [docs/STRUCTURE.md](docs/STRUCTURE.md)。

## 本地运行

1. 后端：
   ```bash
   cd backend && npm install && npm start
   ```
   这将启动一个在 `localhost:3000` 提供 `GET /api/events` 的简单 API。
2. 前端：
   ```bash
   cd frontend && npm install && npm run start
   ```
   打开 `frontend/public/index.html` 即可看到示例页面。
