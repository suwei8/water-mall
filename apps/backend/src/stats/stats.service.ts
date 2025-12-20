import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StatsService {
    constructor(private prisma: PrismaService) { }

    /**
     * 获取总览统计
     */
    async getOverview(shopId: string) {
        const [
            totalOrders,
            todayOrders,
            totalUsers,
            totalProducts,
        ] = await Promise.all([
            this.prisma.order.count({ where: { shopId } }),
            this.prisma.order.count({
                where: {
                    shopId,
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            }),
            this.prisma.user.count({ where: { shopId } }),
            this.prisma.product.count({ where: { shopId, isActive: true } }),
        ]);

        // 计算销售额
        const orders = await this.prisma.order.findMany({
            where: { shopId, status: { in: ['PAID', 'COMPLETED', 'DISPATCHED', 'DELIVERING'] } },
            select: { payAmount: true },
        });
        const totalSales = orders.reduce((sum, o) => sum + Number(o.payAmount), 0);

        const todayOrdersData = await this.prisma.order.findMany({
            where: {
                shopId,
                createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                status: { in: ['PAID', 'COMPLETED', 'DISPATCHED', 'DELIVERING'] },
            },
            select: { payAmount: true },
        });
        const todaySales = todayOrdersData.reduce((sum, o) => sum + Number(o.payAmount), 0);

        return {
            totalOrders,
            todayOrders,
            totalSales: totalSales.toFixed(2),
            todaySales: todaySales.toFixed(2),
            totalUsers,
            totalProducts,
        };
    }

    /**
     * 获取销售趋势
     */
    async getSalesTrend(shopId: string, period: string = 'week') {
        const days = period === 'month' ? 30 : 7;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const orders = await this.prisma.order.findMany({
            where: {
                shopId,
                createdAt: { gte: startDate },
                status: { in: ['PAID', 'COMPLETED', 'DISPATCHED', 'DELIVERING'] },
            },
            select: {
                payAmount: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        // Group by date
        const salesByDate: Record<string, { orders: number; sales: number }> = {};

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            const dateStr = date.toISOString().split('T')[0];
            salesByDate[dateStr] = { orders: 0, sales: 0 };
        }

        orders.forEach(order => {
            const dateStr = order.createdAt.toISOString().split('T')[0];
            if (salesByDate[dateStr]) {
                salesByDate[dateStr].orders += 1;
                salesByDate[dateStr].sales += Number(order.payAmount);
            }
        });

        return Object.entries(salesByDate).map(([date, data]) => ({
            date,
            orders: data.orders,
            sales: parseFloat(data.sales.toFixed(2)),
        }));
    }
}
