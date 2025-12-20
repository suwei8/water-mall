#!/bin/bash
set -e

echo "🚀 Starting Water-Mall services..."

# 初始化数据库
./scripts/init-db.sh

# 启动Backend
echo ""
echo "🔧 Starting Backend service..."
cd apps/backend
npm run start:dev > ../../backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../../backend.pid
cd ../..
echo "✅ Backend started (PID: $BACKEND_PID)"

# 等待Backend启动
echo "⏳ Waiting for Backend to be ready..."
sleep 8

# 检查Backend是否启动成功
if lsof -i :3000 >/dev/null 2>&1; then
    echo "✅ Backend is listening on port 3000"
else
    echo "❌ Backend failed to start"
    exit 1
fi

# 启动Admin
echo ""
echo "🎨 Starting Admin dashboard..."
cd apps/admin
npm run start:dev > ../../admin.log 2>&1 &
ADMIN_PID=$!
echo $ADMIN_PID > ../../admin.pid
cd ../..
echo "✅ Admin started (PID: $ADMIN_PID)"

# 启动Miniapp (如果需要)
# echo ""
# echo "📱 Starting Miniapp..."
# cd apps/miniapp
# npm run dev:h5 > ../../miniapp.log 2>&1 &
# echo $! > ../../miniapp.pid
# cd ../..

echo ""
echo "✅ All services started successfully!"
echo ""
echo "📋 Service URLs:"
echo "   Backend API:     http://localhost:3000"
echo "   Admin Dashboard: http://localhost:8000"
echo "   Miniapp:         http://localhost:5173"
echo ""
echo "👤 Admin credentials:"
echo "   Username: admin"
echo "   Password: sw63828"
echo ""
echo "📝 Logs:"
echo "   Backend: tail -f backend.log"
echo "   Admin:   tail -f admin.log"
