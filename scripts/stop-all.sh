#!/bin/bash

echo "🛑 Stopping Water-Mall services..."

# 停止Backend
if [ -f backend.pid ]; then
    BACKEND_PID=$(cat backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "Stopping Backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null || true
        # 也杀掉子进程
        pkill -P $BACKEND_PID 2>/dev/null || true
    fi
    rm -f backend.pid
fi

# 停止Admin
if [ -f admin.pid ]; then
    ADMIN_PID=$(cat admin.pid)
    if ps -p $ADMIN_PID > /dev/null 2>&1; then
        echo "Stopping Admin (PID: $ADMIN_PID)..."
        kill $ADMIN_PID 2>/dev/null || true
        pkill -P $ADMIN_PID 2>/dev/null || true
    fi
    rm -f admin.pid
fi

# 停止Miniapp
if [ -f miniapp.pid ]; then
    MINIAPP_PID=$(cat miniapp.pid)
    if ps -p $MINIAPP_PID > /dev/null 2>&1; then
        echo "Stopping Miniapp (PID: $MINIAPP_PID)..."
        kill $MINIAPP_PID 2>/dev/null || true
        pkill -P $MINIAPP_PID 2>/dev/null || true
    fi
    rm -f miniapp.pid
fi

# 额外清理：杀掉所有相关进程
pkill -f "nest start --watch" 2>/dev/null || true
pkill -f "max dev" 2>/dev/null || true

echo "✅ All services stopped"
