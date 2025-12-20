# Water-Mall 2.0

一个基于 NestJS + Ant Design Pro + Uni-app 的水产品配送 SaaS 平台。

## 📋 项目概述

Water-Mall 是一个多租户的水产品配送管理系统,支持商户管理、订单处理、配送调度、会员管理等核心功能。

### 技术栈

#### 后端 (Backend)
- **框架**: NestJS (Node.js + TypeScript)
- **数据库**: PostgreSQL 15+ with Prisma ORM
- **架构**: Modular Monolith (模块化单体)
- **认证**: JWT + Passport

####前端管理后台 (Admin)
- **框架**: React 18 + Ant Design Pro (UmiJS 4)
- **UI 组件**: Ant Design 6.x
- **状态管理**: UmiJS 内置状态管理

#### 小程序 (Miniapp)
- **框架**: Uni-app (Vue 3)
- **支持平台**: 微信小程序、抖音小程序等

## 🏗️ 项目结构

```
water-mall/
├── apps/
│   ├── backend/          # NestJS 后端服务
│   │   ├── src/
│   │   │   ├── auth/     # 认证模块
│   │   │   ├── admin/    # 管理员模块
│   │   │   ├── product/  # 商品管理
│   │   │   ├── order/    # 订单管理
│   │   │   ├── user/     # 用户/会员管理
│   │   │   ├── dispatcher/ # 配送调度
│   │   │   ├── shop/     # 商户管理
│   │   │   └── ...
│   │   ├── prisma/       # 数据库 Schema 和迁移
│   │   └── package.json
│   ├── admin/            # Ant Design Pro 管理后台
│   │   ├── src/
│   │   │   ├── pages/    # 页面组件
│   │   │   ├── services/ # API 服务
│   │   │   └── ...
│   │   └── package.json
│   └── miniapp/          # Uni-app 小程序
│       └── package.json
├── doc/                  # 项目文档
│   ├── 当前项目架构+功能清单分析报告.md
│   └── 新系统开放设计方案.md
├── schema.sql            # MySQL 数据库备份(旧系统)
├── .gitignore
└── README.md
```

## 🚀 快速开始

### 环境要求

- Node.js >= 20.0.0
- Docker (用于运行PostgreSQL)
- Redis (可选,用于缓存)
- npm 或 pnpm

### 一键启动 (推荐)

确保Docker容器 `water-db` 正在运行，然后执行:

```bash
# 初始化数据库并启动所有服务
./scripts/start-all.sh
```

这个脚本会自动:
- ✅ 检查并创建数据库
- ✅ 运行数据库迁移
- ✅ 初始化种子数据
- ✅ 启动Backend服务 (端口 3000)
- ✅ 启动Admin管理后台 (端口 8000)

停止所有服务:
```bash
./scripts/stop-all.sh
```

### 手动启动

#### 1. 初始化数据库

```bash
# 仅初始化数据库(不启动服务)
./scripts/init-db.sh
```

#### 2. 后端启动

```bash
cd apps/backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件,配置数据库连接等信息

# 开发模式启动
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

后端服务默认运行在: `http://localhost:3000`

#### 3. 前端管理后台启动

```bash
cd apps/admin

# 安装依赖
npm install

# 开发模式启动
npm run start:dev

# 构建生产版本
npm run build
```

管理后台默认运行在: `http://localhost:8000`

### 小程序开发

```bash
cd apps/miniapp

# 安装依赖
npm install

# 开发模式(微信小程序)
npm run dev:mp-weixin

# 构建
npm run build:mp-weixin
```

## 📚 核心功能模块

### 1. 多租户管理
- 平台总后台:管理所有商户
- 商户独立后台:每个商户独立管理自己的数据
- 数据逻辑隔离:通过 `shop_id` 区分

### 2. 商品与订单
- 商品管理:支持多规格 SKU
- 水票系统:预付费模式
- 订单流转:待支付 → 待接单 → 待派单 → 配送中 → 已完成

### 3. 配送调度
- 配送员管理
- 手动派单
- 配送状态追踪
- SMS 通知

### 4. 会员系统
- 会员等级管理
- 积分与余额
- 押金管理(桶/饮水机)
- 充值记录

### 5. 营销工具
- 优惠券:普通券、新人券、会员券
- 合伙人分红
- 推荐奖励

### 6. 权限管理
- 基于角色的权限控制 (RBAC)
- 细粒度的功能权限
- 商户子账号管理

## 🔧 开发指南

### 后端 API 文档

启动后端服务后,访问 Swagger 文档:
```
http://localhost:3000/api
```

### 数据库管理

```bash
# 查看数据库
npx prisma studio

# 创建新迁移
npx prisma migrate dev --name migration_name

# 重置数据库
npx prisma migrate reset
```

### 代码规范

```bash
# 后端 Lint
cd apps/backend
npm run lint

# 前端 Lint
cd apps/admin
npm run lint
```

## 📖 相关文档

- [当前项目架构+功能清单分析报告](./doc/当前项目架构+功能清单分析报告.md)
- [新系统开发设计方案](./doc/新系统开放设计方案.md)
- [NestJS 官方文档](https://nestjs.com/)
- [Ant Design Pro 文档](https://pro.ant.design/)
- [Prisma 文档](https://www.prisma.io/docs)

## 🔐 默认账户

### 管理后台
- 用户名: `admin`
- 密码: `admin123`

(请在生产环境中修改默认密码!)

## 📝 待办事项

- [ ] 实现基于 PostGIS 的智能派单
- [ ] 完善库存管理系统
- [ ] 增加数据统计报表
- [ ] 优化小程序性能
- [ ] 添加单元测试和 E2E 测试

## 📄 License

MIT

## 👥 贡献者

欢迎提交 Issue 和 Pull Request!
