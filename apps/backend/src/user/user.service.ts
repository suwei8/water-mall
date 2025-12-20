import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    /**
     * 获取用户列表（分页）
     */
    async findAll(shopId: string, options: {
        skip?: number;
        take?: number;
        search?: string;
    } = {}) {
        const { skip = 0, take = 20, search } = options;

        const where: any = { shopId };

        if (search) {
            where.OR = [
                { mobile: { contains: search } },
                { name: { contains: search } },
            ];
        }

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    mobile: true,
                    name: true,
                    balance: true,
                    points: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: { orders: true, coupons: true },
                    },
                },
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            data: users.map(u => ({
                ...u,
                orderCount: u._count.orders,
                couponCount: u._count.coupons,
            })),
            total,
            success: true,
        };
    }

    /**
     * 获取用户详情
     */
    async findOne(shopId: string, userId: string) {
        return this.prisma.user.findFirst({
            where: { id: userId, shopId },
            select: {
                id: true,
                mobile: true,
                name: true,
                balance: true,
                points: true,
                openid: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        orders: true,
                        addresses: true,
                        coupons: true,
                    },
                },
            },
        });
    }

    /**
     * 获取用户订单历史
     */
    async getUserOrders(shopId: string, userId: string, options: {
        skip?: number;
        take?: number;
    } = {}) {
        const { skip = 0, take = 10 } = options;

        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where: { userId, shopId },
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    status: true,
                    totalAmount: true,
                    payAmount: true,
                    items: true,
                    createdAt: true,
                },
            }),
            this.prisma.order.count({ where: { userId, shopId } }),
        ]);

        return {
            data: orders,
            total,
            success: true,
        };
    }

    /**
     * 获取用户统计
     */
    async getUserStats(shopId: string, userId: string) {
        const orders = await this.prisma.order.findMany({
            where: { userId, shopId, status: 'COMPLETED' },
            select: { payAmount: true },
        });

        const totalSpent = orders.reduce((sum, o) => sum + Number(o.payAmount), 0);

        return {
            orderCount: orders.length,
            totalSpent,
        };
    }

    /**
     * 充值余额
     */
    async rechargeBalance(shopId: string, userId: string, amount: number, remark?: string) {
        // 验证用户存在
        const user = await this.prisma.user.findFirst({
            where: { id: userId, shopId },
        });
        if (!user) {
            throw new Error('用户不存在');
        }

        // 使用事务确保数据一致性
        return this.prisma.$transaction(async (tx) => {
            // 更新用户余额
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: { balance: { increment: amount } },
            });

            // 创建余额记录
            await tx.balanceRecord.create({
                data: {
                    userId,
                    type: 'RECHARGE',
                    amount,
                    balance: updatedUser.balance,
                    remark: remark || '管理员充值',
                },
            });

            return updatedUser;
        });
    }

    /**
     * 赠送积分
     */
    async giftPoints(shopId: string, userId: string, amount: number, remark?: string) {
        // 验证用户存在
        const user = await this.prisma.user.findFirst({
            where: { id: userId, shopId },
        });
        if (!user) {
            throw new Error('用户不存在');
        }

        // 使用事务确保数据一致性
        return this.prisma.$transaction(async (tx) => {
            // 更新用户积分
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: { points: { increment: amount } },
            });

            // 创建积分记录
            await tx.pointsRecord.create({
                data: {
                    userId,
                    type: 'GIFT',
                    amount,
                    balance: updatedUser.points,
                    remark: remark || '管理员赠送',
                },
            });

            return updatedUser;
        });
    }

    /**
     * 获取用户余额记录
     */
    async getBalanceRecords(shopId: string, userId: string, options: {
        skip?: number;
        take?: number;
    } = {}) {
        const { skip = 0, take = 10 } = options;

        // 验证用户属于该店铺
        const user = await this.prisma.user.findFirst({
            where: { id: userId, shopId },
        });
        if (!user) {
            throw new Error('用户不存在');
        }

        const [records, total] = await Promise.all([
            this.prisma.balanceRecord.findMany({
                where: { userId },
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.balanceRecord.count({ where: { userId } }),
        ]);

        return {
            data: records,
            total,
            success: true,
        };
    }

    /**
     * 获取用户积分记录
     */
    async getPointsRecords(shopId: string, userId: string, options: {
        skip?: number;
        take?: number;
    } = {}) {
        const { skip = 0, take = 10 } = options;

        // 验证用户属于该店铺
        const user = await this.prisma.user.findFirst({
            where: { id: userId, shopId },
        });
        if (!user) {
            throw new Error('用户不存在');
        }

        const [records, total] = await Promise.all([
            this.prisma.pointsRecord.findMany({
                where: { userId },
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.pointsRecord.count({ where: { userId } }),
        ]);

        return {
            data: records,
            total,
            success: true,
        };
    }

    /**
     * 获取用户优惠券列表
     */
    async getUserCoupons(shopId: string, userId: string, options: {
        skip?: number;
        take?: number;
        status?: string;
    } = {}) {
        const { skip = 0, take = 10, status } = options;

        // 验证用户属于该店铺
        const user = await this.prisma.user.findFirst({
            where: { id: userId, shopId },
        });
        if (!user) {
            throw new Error('用户不存在');
        }

        const where: any = { userId };
        if (status) {
            where.status = status;
        }

        const [coupons, total] = await Promise.all([
            this.prisma.userCoupon.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    coupon: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                            value: true,
                            minSpend: true,
                            useStartAt: true,
                            useEndAt: true,
                        },
                    },
                },
            }),
            this.prisma.userCoupon.count({ where }),
        ]);

        return {
            data: coupons,
            total,
            success: true,
        };
    }
}

