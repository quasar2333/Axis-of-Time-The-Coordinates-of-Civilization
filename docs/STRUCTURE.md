# 项目文件和目录结构规划

以下是“时光之轴：文明坐标”项目在完成 Phase 1 后建议采用的目录结构。该结构涵盖前端、后端、数据处理以及文档部分，便于后续扩展。

```
.
├── backend/                # Node.js + Express 服务端代码
│   ├── package.json        # 后端依赖及脚本
│   ├── src/
│   │   ├── index.js        # 服务入口
│   │   ├── routes/         # 路由定义
│   │   ├── controllers/    # 业务控制层
│   │   ├── models/         # 数据库模型（使用 Sequelize 或类似 ORM）
│   │   └── config/         # 数据库连接等配置
│   └── tests/              # 后端测试代码
│
├── frontend/               # React 前端代码
│   ├── package.json        # 前端依赖及脚本
│   ├── public/
│   │   └── index.html      # HTML 模板
│   └── src/
│       ├── index.jsx       # 前端入口
│       ├── components/     # React 组件
│       ├── store/          # Redux 状态管理
│       ├── styles/         # 全局样式或 Tailwind 配置
│       └── utils/          # 通用工具函数
│
├── data/                   # 数据及脚本
│   ├── seeds/              # 初始 CSV/JSON 数据（教材、朝代等）
│   └── scripts/            # Python 爬虫及数据处理脚本
│       └── scrape_baidu.py
│
├── docs/                   # 项目文档
│   ├── STRUCTURE.md        # 当前文件，目录结构说明
│   └── README.md           # 其他文档或设计说明
│
├── .gitignore              # Git 忽略文件
└── README.md               # 项目总览及运行说明
```

## 说明
- `backend/` 和 `frontend/` 分别存放后端与前端代码，互不干扰。
- `data/` 下包含初始数据以及用于抓取和清洗数据的 Python 脚本。
- `docs/` 用于放置设计文档、流程图等资料。
- 根目录下的 `README.md` 将提供项目简介和本地运行指南。

该结构可随着项目推进进一步细化。完成 Phase 1 后，会在此基础上逐步填充代码与数据。

