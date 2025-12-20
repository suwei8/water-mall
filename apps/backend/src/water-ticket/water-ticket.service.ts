import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class WaterTicketService {
    constructor(private prisma: PrismaService) { }

    // ==================== 管理后台 API ====================

    /**
     * 获取水票类型列表（管理后台）
     */
    async findAllTicketTypes(shopId: string, options: {
        skip?: number;
        take?: number;
    } = {}) {
        const { skip = 0, take = 20 } = options;

        const [tickets, total] = await Promise.all([
            this.prisma.waterTicket.findMany({
                where: { shopId },
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { userTickets: true },
                    },
                },
            }),
            this.prisma.waterTicket.count({ where: { shopId } }),
        ]);

        return {
            data: tickets.map(t => ({
                ...t,
                soldCount: t._count.userTickets,
            })),
            total,
            success: true,
        };
    }

    /**
     * 创建水票类型
     */
    async createTicketType(shopId: string, data: {
        name: string;
        productId?: string;
        quantity: number;
        price: number;
        originalPrice?: number;
        validDays?: number;
    }) {
        return this.prisma.waterTicket.create({
            data: {
                shopId,
                name: data.name,
                productId: data.productId || null,
                quantity: data.quantity,
                price: data.price,
                originalPrice: data.originalPrice || null,
                validDays: data.validDays || 365,
            },
        });
    }

    /**
     * 更新水票类型
     */
    async updateTicketType(shopId: string, id: string, data: any) {
        const existing = await this.prisma.waterTicket.findFirst({
            where: { id, shopId },
        });
        if (!existing) return null;

        return this.prisma.waterTicket.update({
            where: { id },
            data: {
                name: data.name ?? existing.name,
                productId: data.productId ?? existing.productId,
                quantity: data.quantity ?? existing.quantity,
                price: data.price ?? existing.price,
                originalPrice: data.originalPrice ?? existing.originalPrice,
                validDays: data.validDays ?? existing.validDays,
                isActive: data.isActive ?? existing.isActive,
            },
        });
    }

    /**
     * 删除水票类型
     */
    async deleteTicketType(shopId: string, id: string) {
        const existing = await this.prisma.waterTicket.findFirst({
            where: { id, shopId },
        });
        if (!existing) return null;

        // 检查是否有用户持有
        const userTicketCount = await this.prisma.userWaterTicket.count({
            where: { ticketId: id, status: 'VALID' },
        });
        if (userTicketCount > 0) {
            throw new BadRequestException('该水票有用户持有中，无法删除');
        }

        return this.prisma.waterTicket.delete({ where: { id } });
    }

    // ==================== 小程序端 API ====================

    /**
     * 获取可购买的水票列表（小程序端）
     */
    async getAvailableTickets(shopId: string) {
        return this.prisma.waterTicket.findMany({
            where: { shopId, isActive: true },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                quantity: true,
                price: true,
                originalPrice: true,
                validDays: true,
            },
        });
    }

    /**
     * 用户购买水票
     */
    async purchaseTicket(userId: string, ticketId: string) {
        const ticket = await this.prisma.waterTicket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket || !ticket.isActive) {
            throw new BadRequestException('水票不存在或已下架');
        }

        // 计算过期时间
        const expireAt = new Date();
        expireAt.setDate(expireAt.getDate() + ticket.validDays);

        // 创建用户水票
        const userTicket = await this.prisma.userWaterTicket.create({
            data: {
                userId,
                ticketId,
                remaining: ticket.quantity,
                expireAt,
                status: 'VALID',
            },
        });

        // 更新发行量
        await this.prisma.waterTicket.update({
            where: { id: ticketId },
            data: { totalIssued: { increment: 1 } },
        });

        return userTicket;
    }

    /**
     * 获取用户的水票列表
     */
    async getUserTickets(userId: string, status?: string) {
        const where: any = { userId };
        if (status) {
            where.status = status;
        }

        const tickets = await this.prisma.userWaterTicket.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                ticket: {
                    select: {
                        name: true,
                        productId: true,
                    },
                },
            },
        });

        // 检查过期
        const now = new Date();
        for (const t of tickets) {
            if (t.status === 'VALID' && t.expireAt < now) {
                await this.prisma.userWaterTicket.update({
                    where: { id: t.id },
                    data: { status: 'EXPIRED' },
                });
                t.status = 'EXPIRED';
            }
        }

        return tickets;
    }

    /**
     * 使用水票（下单时核销）
     */
    async useTicket(userTicketId: string, quantity: number, orderId?: string) {
        const userTicket = await this.prisma.userWaterTicket.findUnique({
            where: { id: userTicketId },
        });

        if (!userTicket) {
            throw new BadRequestException('水票不存在');
        }

        if (userTicket.status !== 'VALID') {
            throw new BadRequestException('水票已使用或已过期');
        }

        if (userTicket.expireAt < new Date()) {
            await this.prisma.userWaterTicket.update({
                where: { id: userTicketId },
                data: { status: 'EXPIRED' },
            });
            throw new BadRequestException('水票已过期');
        }

        if (userTicket.remaining < quantity) {
            throw new BadRequestException(`水票剩余数量不足，当前剩余 ${userTicket.remaining}`);
        }

        const newRemaining = userTicket.remaining - quantity;
        const newStatus = newRemaining === 0 ? 'USED' : 'VALID';

        // 更新水票
        await this.prisma.userWaterTicket.update({
            where: { id: userTicketId },
            data: {
                remaining: newRemaining,
                status: newStatus,
            },
        });

        // 记录使用日志
        await this.prisma.ticketUsageLog.create({
            data: {
                userTicketId,
                orderId,
                quantity,
            },
        });

        return { success: true, remaining: newRemaining };
    }

    /**
     * 获取水票使用记录
     */
    async getTicketUsageLogs(userTicketId: string) {
        return this.prisma.ticketUsageLog.findMany({
            where: { userTicketId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
