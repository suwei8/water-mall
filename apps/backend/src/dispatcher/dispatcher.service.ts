import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DispatcherService {
    constructor(private prisma: PrismaService) { }

    // ==================== 配送员管理 ====================

    /**
     * 获取配送员列表
     */
    async findAll(shopId: string, options: {
        skip?: number;
        take?: number;
        status?: string;
    } = {}) {
        const { skip = 0, take = 20, status } = options;

        const where: any = { shopId };
        if (status) {
            where.status = status;
        }

        const [dispatchers, total] = await Promise.all([
            this.prisma.dispatcher.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { dispatches: true },
                    },
                },
            }),
            this.prisma.dispatcher.count({ where }),
        ]);

        return {
            data: dispatchers.map(d => ({
                ...d,
                dispatchCount: d._count.dispatches,
            })),
            total,
            success: true,
        };
    }

    /**
     * 创建配送员
     */
    async create(shopId: string, data: {
        name: string;
        phone: string;
        areaIds?: string[];
    }) {
        // 检查手机号是否已存在
        const existing = await this.prisma.dispatcher.findFirst({
            where: { shopId, phone: data.phone },
        });
        if (existing) {
            throw new BadRequestException('该手机号已存在');
        }

        return this.prisma.dispatcher.create({
            data: {
                shopId,
                name: data.name,
                phone: data.phone,
                areaIds: data.areaIds || [],
            },
        });
    }

    /**
     * 更新配送员
     */
    async update(shopId: string, id: string, data: any) {
        const existing = await this.prisma.dispatcher.findFirst({
            where: { id, shopId },
        });
        if (!existing) return null;

        return this.prisma.dispatcher.update({
            where: { id },
            data: {
                name: data.name ?? existing.name,
                phone: data.phone ?? existing.phone,
                status: data.status ?? existing.status,
                areaIds: data.areaIds ?? existing.areaIds,
            },
        });
    }

    /**
     * 删除配送员
     */
    async delete(shopId: string, id: string) {
        const existing = await this.prisma.dispatcher.findFirst({
            where: { id, shopId },
        });
        if (!existing) return null;

        // 检查是否有进行中的派单
        const activeDispatchCount = await this.prisma.orderDispatch.count({
            where: {
                dispatcherId: id,
                status: { in: ['ASSIGNED', 'ACCEPTED', 'DELIVERING'] }
            },
        });
        if (activeDispatchCount > 0) {
            throw new BadRequestException('该配送员有进行中的配送任务，无法删除');
        }

        return this.prisma.dispatcher.delete({ where: { id } });
    }

    // ==================== 派单管理 ====================

    /**
     * 获取待派单订单列表
     */
    async getPendingOrders(shopId: string) {
        // 获取已支付但未派单的订单
        const dispatchedOrderIds = await this.prisma.orderDispatch.findMany({
            select: { orderId: true },
        });
        const dispatchedIds = dispatchedOrderIds.map(d => d.orderId);

        return this.prisma.order.findMany({
            where: {
                shopId,
                status: { in: ['PAID'] },
                id: { notIn: dispatchedIds },
            },
            orderBy: { createdAt: 'asc' },
        });
    }

    /**
     * 派单
     */
    async assignOrder(orderId: string, dispatcherId: string, note?: string) {
        // 检查订单是否存在
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new BadRequestException('订单不存在');
        }

        // 检查是否已派单
        const existingDispatch = await this.prisma.orderDispatch.findUnique({
            where: { orderId },
        });
        if (existingDispatch) {
            throw new BadRequestException('该订单已派单');
        }

        // 检查配送员
        const dispatcher = await this.prisma.dispatcher.findUnique({
            where: { id: dispatcherId },
        });
        if (!dispatcher || dispatcher.status !== 'ACTIVE') {
            throw new BadRequestException('配送员不存在或已禁用');
        }

        // 创建派单记录
        const dispatch = await this.prisma.orderDispatch.create({
            data: {
                orderId,
                dispatcherId,
                status: 'ASSIGNED',
                note,
            },
        });

        // 更新订单状态
        await this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'DISPATCHED',
                dispatchInfo: {
                    dispatcherId,
                    dispatcherName: dispatcher.name,
                    dispatcherPhone: dispatcher.phone,
                    assignedAt: new Date().toISOString(),
                },
            },
        });

        return dispatch;
    }

    /**
     * 更新派单状态
     */
    async updateDispatchStatus(dispatchId: string, status: string) {
        const dispatch = await this.prisma.orderDispatch.findUnique({
            where: { id: dispatchId },
        });
        if (!dispatch) {
            throw new BadRequestException('派单记录不存在');
        }

        const updateData: any = { status };

        if (status === 'ACCEPTED') {
            updateData.acceptedAt = new Date();
        } else if (status === 'COMPLETED') {
            updateData.completedAt = new Date();
        }

        // 同步更新订单状态
        let orderStatus = dispatch.status;
        if (status === 'DELIVERING') {
            orderStatus = 'DELIVERING';
        } else if (status === 'COMPLETED') {
            orderStatus = 'COMPLETED';
        } else if (status === 'CANCELLED') {
            orderStatus = 'PAID'; // 取消派单，回到已支付状态
        }

        await Promise.all([
            this.prisma.orderDispatch.update({
                where: { id: dispatchId },
                data: updateData,
            }),
            this.prisma.order.update({
                where: { id: dispatch.orderId },
                data: { status: orderStatus },
            }),
        ]);

        return { success: true };
    }

    /**
     * 获取派单列表
     */
    async getDispatches(shopId: string, options: {
        skip?: number;
        take?: number;
        status?: string;
        dispatcherId?: string;
    } = {}) {
        const { skip = 0, take = 20, status, dispatcherId } = options;

        const where: any = {
            dispatcher: { shopId },
        };
        if (status) {
            where.status = status;
        }
        if (dispatcherId) {
            where.dispatcherId = dispatcherId;
        }

        const [dispatches, total] = await Promise.all([
            this.prisma.orderDispatch.findMany({
                where,
                skip,
                take,
                orderBy: { assignedAt: 'desc' },
                include: {
                    dispatcher: {
                        select: { name: true, phone: true },
                    },
                },
            }),
            this.prisma.orderDispatch.count({ where }),
        ]);

        return {
            data: dispatches,
            total,
            success: true,
        };
    }

    /**
     * 获取配送员的派单列表
     */
    async getDispatcherOrders(dispatcherId: string, status?: string) {
        const where: any = { dispatcherId };
        if (status) {
            where.status = status;
        }

        const dispatches = await this.prisma.orderDispatch.findMany({
            where,
            orderBy: { assignedAt: 'desc' },
        });

        // 获取订单详情
        const orderIds = dispatches.map(d => d.orderId);
        const orders = await this.prisma.order.findMany({
            where: { id: { in: orderIds } },
        });

        const orderMap = new Map(orders.map(o => [o.id, o]));

        return dispatches.map(d => ({
            ...d,
            order: orderMap.get(d.orderId),
        }));
    }
}
