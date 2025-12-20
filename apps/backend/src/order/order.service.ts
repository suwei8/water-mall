import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) { }

    async findAll(shopId: string, params?: {
        skip?: number;
        take?: number;
        status?: string;
    }) {
        const where: Prisma.OrderWhereInput = { shopId };

        if (params?.status) {
            where.status = params.status;
        }

        const [items, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip: params?.skip || 0,
                take: params?.take || 20,
                include: { user: true },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.order.count({ where }),
        ]);

        return { items, total };
    }

    async findOne(shopId: string, id: string) {
        return this.prisma.order.findFirst({
            where: { id, shopId },
            include: { user: true },
        });
    }

    async updateStatus(shopId: string, id: string, status: string) {
        const order = await this.prisma.order.findFirst({
            where: { id, shopId },
        });
        if (!order) return null;

        return this.prisma.order.update({
            where: { id },
            data: { status },
        });
    }

    async create(shopId: string, userId: string, data: {
        items: any;
        totalAmount: number;
        payAmount: number;
    }) {
        return this.prisma.order.create({
            data: {
                shop: { connect: { id: shopId } },
                user: { connect: { id: userId } },
                items: data.items,
                totalAmount: data.totalAmount,
                payAmount: data.payAmount,
                status: 'PENDING',
            },
        });
    }
}
