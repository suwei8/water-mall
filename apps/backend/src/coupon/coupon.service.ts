import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

// 优惠券分类
export const COUPON_CATEGORIES = {
    NORMAL: 'NORMAL',       // 普通券
    NEW_USER: 'NEW_USER',   // 新人券
    MEMBER: 'MEMBER',       // 会员券
    INVITE: 'INVITE',       // 邀请券
} as const;

@Injectable()
export class CouponService {
    constructor(private prisma: PrismaService) { }

    /**
     * 获取优惠券列表
     */
    async findAll(shopId: string, options: {
        skip?: number;
        take?: number;
        category?: string;
    } = {}) {
        const { skip = 0, take = 20, category } = options;

        const where: any = { shopId };
        if (category) {
            where.category = category;
        }

        const [coupons, total] = await Promise.all([
            this.prisma.coupon.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { userCoupons: true },
                    },
                },
            }),
            this.prisma.coupon.count({ where }),
        ]);

        return {
            data: coupons.map(c => ({
                ...c,
                usedCount: c._count.userCoupons,
            })),
            total,
            success: true,
        };
    }

    /**
     * 获取单个优惠券
     */
    async findOne(shopId: string, id: string) {
        return this.prisma.coupon.findFirst({
            where: { id, shopId },
        });
    }

    /**
     * 创建优惠券
     */
    async create(shopId: string, data: {
        name: string;
        category?: string;
        type?: string;
        value: number;
        minSpend?: number;
        issueStartAt?: Date;
        issueEndAt?: Date;
        useStartAt?: Date;
        useEndAt?: Date;
        quota?: number;
        pointsExchange?: boolean;
        pointsCost?: number;
        applicableScope?: any;
    }) {
        return this.prisma.coupon.create({
            data: {
                shopId,
                name: data.name,
                category: data.category || 'NORMAL',
                type: data.type || 'FULL_REDUCTION',
                value: data.value,
                minSpend: data.minSpend || 0,
                issueStartAt: data.issueStartAt || null,
                issueEndAt: data.issueEndAt || null,
                useStartAt: data.useStartAt || null,
                useEndAt: data.useEndAt || null,
                quota: data.quota || 0,
                pointsExchange: data.pointsExchange || false,
                pointsCost: data.pointsCost || 0,
                applicableScope: data.applicableScope || null,
            },
        });
    }

    /**
     * 更新优惠券
     */
    async update(shopId: string, id: string, data: any) {
        const existing = await this.findOne(shopId, id);
        if (!existing) return null;

        return this.prisma.coupon.update({
            where: { id },
            data: {
                name: data.name ?? existing.name,
                category: data.category ?? existing.category,
                type: data.type ?? existing.type,
                value: data.value ?? existing.value,
                minSpend: data.minSpend ?? existing.minSpend,
                issueStartAt: data.issueStartAt ?? existing.issueStartAt,
                issueEndAt: data.issueEndAt ?? existing.issueEndAt,
                useStartAt: data.useStartAt ?? existing.useStartAt,
                useEndAt: data.useEndAt ?? existing.useEndAt,
                quota: data.quota ?? existing.quota,
                pointsExchange: data.pointsExchange ?? existing.pointsExchange,
                pointsCost: data.pointsCost ?? existing.pointsCost,
                applicableScope: data.applicableScope ?? existing.applicableScope,
                isActive: data.isActive ?? existing.isActive,
            },
        });
    }

    /**
     * 删除优惠券
     */
    async delete(shopId: string, id: string) {
        const existing = await this.findOne(shopId, id);
        if (!existing) return null;

        return this.prisma.coupon.delete({ where: { id } });
    }

    /**
     * 发放优惠券给用户
     */
    async issueCoupon(userId: string, couponId: string) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { id: couponId },
        });

        if (!coupon || !coupon.isActive) {
            throw new Error('优惠券不存在或已下架');
        }

        // 检查配额
        if (coupon.quota > 0 && coupon.issuedCount >= coupon.quota) {
            throw new Error('优惠券已领完');
        }

        // 检查发放时间
        const now = new Date();
        if (coupon.issueStartAt && now < coupon.issueStartAt) {
            throw new Error('优惠券发放未开始');
        }
        if (coupon.issueEndAt && now > coupon.issueEndAt) {
            throw new Error('优惠券发放已结束');
        }

        // 创建用户优惠券
        const userCoupon = await this.prisma.userCoupon.create({
            data: {
                userId,
                couponId,
                status: 'UNUSED',
            },
        });

        // 更新发放计数
        await this.prisma.coupon.update({
            where: { id: couponId },
            data: { issuedCount: { increment: 1 } },
        });

        return userCoupon;
    }

    /**
     * 自动发放新人券（用户注册时调用）
     */
    async issueNewUserCoupons(shopId: string, userId: string) {
        const newUserCoupons = await this.prisma.coupon.findMany({
            where: {
                shopId,
                category: 'NEW_USER',
                isActive: true,
            },
        });

        for (const coupon of newUserCoupons) {
            try {
                await this.issueCoupon(userId, coupon.id);
            } catch (e) {
                console.error(`Failed to issue new user coupon ${coupon.id}:`, e);
            }
        }
    }
}
