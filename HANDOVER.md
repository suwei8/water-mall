# 水优选订水平台 - 项目交接文档 (HANDOVER.md)

## 1. 项目简介
**项目名称**：水优选订水平台 (Water Mall)
**项目定位**：专为中小水企打造的数字化订水/配送管理系统。
**核心业务**：支持一键订水、电子水票、空桶押金管理、配送员调度、多门店/区域管理。

**代码仓库结构** (Monorepo):
- `apps/miniapp`: C端微信小程序 (UniApp + Vue3 + TS)
- `apps/backend`: 后端服务 (NestJS + Prisma + PostgreSQL)
- `apps/admin`: 管理后台 (React/AntD - *待确认完善*)

## 2. 技术栈详情

### 前端小程序 (`apps/miniapp`)
- **框架**: UniApp (Vite + Vue 3 Setup Script)
- **语言**: TypeScript
- **状态管理**: Pinia
- **样式**: SCSS (已引入 `sass` 依赖)
- **UI风格**: "Water Enterprise" 定制主题 (主色: `#00A0E9`)

### 后端服务 (`apps/backend`)
- **框架**: NestJS
- **ORM**: Prisma
- **数据库**: PostgreSQL
- **鉴权**: JWT + Guards (Role Based)

## 3. 当前开发进度

### 已完成 (Done)
- [x] **UI重构**: 完成小程序核心页面的视觉改版。
    - **首页**: 实现"一键订水"卡片、位置头部、状态仪表盘(水票/押金)。
    - **分类页**: 优化为侧边栏+列表的垂直布局，强调水票支持。
    - **个人中心**: 增加资产看板(剩余水票/押金金额)和网格化菜单。
- [x] **基础配置**: 
    - 统一全局色调变量 (`uni.scss`)。
    - 修复 SCSS 编译依赖问题。
- [x] **后端模型**: 定义了 `WaterTicket` (水票), `Deposit` (押金), `Dispatcher` (配送员) 等核心业务模型。

### 待开发/进行中 (Todo)
- [ ] **接口对接**: 目前前端使用 Mock 数据，需对接后端 `ShopController`, `ProductController`, `OrderController`。
- [ ] **下单流程**: 完善购物车 -> 结算页 -> 支付 -> 生成订单的完整链路。
- [ ] **水票逻辑**: 实现购买水票套餐、下单时自动抵扣水票的后端逻辑。
- [ ] **空桶闭环**: 实现用户退桶申请 -> 配送员回收 -> 押金退还/抵扣流程。

## 4. 环境与部署 (Environment)
- **Node Version**: v16+ (推荐)
- **Database**: PostgreSQL (本地开发连接串见 `.env`)
- **包管理器**: NPM Workspace

### 启动方式
1. **安装依赖**:
   ```bash
   npm install
   ```
2. **启动小程序开发环境**:
   ```bash
   cd apps/miniapp
   npm run dev:h5
   ```
3. **启动后端服务**:
   ```bash
   cd apps/backend
   npx prisma generate
   npm run start:dev
   ```

## 5. 注意事项
1. **样式编译**: 如遇到样式报错，请检查 `apps/miniapp` 下是否安装了 `sass` (`npm install -D sass`).
2. **Git规范**: 提交请遵循 Conventional Commits (feat, fix, chore, docs).
3. **域名配置**: 小程序发布时需在微信后台配置 `request` 合法域名。

## 6. ⚠️ 安全事件报告 (CRITICAL)
**数据库遭遇勒索攻击**。
- **现状**: 本地数据库 `water_mall` 已丢失，发现名为 `readme_to_recover` 的数据库。
- **勒索信息**: 
  > "All your data is backed up. You must pay 0.0051 BTC... Your DBCODE is: 3WR7C"
- **建议**: 
  1. 立即隔离服务器网络。（**已执行：已停止 water-db 容器，关闭 5432 端口**）
  2. 检查是否有其他备份（如云快照）。
  3. **不要支付赎金**，即使支付也无法保证找回数据。
  4. 重新初始化数据库并加强安全防护（检查 PostgreSQL 端口暴露情况）。
