#!/bin/bash
set -e

echo "🔍 Checking database setup..."

# 检查Docker容器是否运行
if ! docker ps | grep -q water-db; then
    echo "❌ Error: Docker container 'water-db' is not running"
    echo "Please start the database container first"
    exit 1
fi

echo "✅ Database container is running"

# 检查数据库是否存在
DB_EXISTS=$(docker exec water-db psql -U postgres -lqt | cut -d \| -f 1 | grep -w water_mall | wc -l)

if [ "$DB_EXISTS" -eq 0 ]; then
    echo "📦 Creating database 'water_mall'..."
    docker exec water-db psql -U postgres -c "CREATE DATABASE water_mall;"
    echo "✅ Database created"
else
    echo "✅ Database 'water_mall' already exists"
fi

# 运行迁移
echo "🔄 Running database migrations..."
cd apps/backend
npx prisma migrate deploy

# 检查是否需要seed（检查是否有数据）
HAS_DATA=$(docker exec water-db psql -U postgres -d water_mall -tAc "SELECT COUNT(*) FROM \"Shop\";")

if [ "$HAS_DATA" -eq 0 ]; then
    echo "🌱 Seeding initial data..."
    npx prisma db seed
    echo "✅ Initial data seeded"
else
    echo "✅ Database already has data (found $HAS_DATA shops)"
fi

echo ""
echo "✅ Database initialization complete!"
