import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DeliveryAreaService {
    constructor(private prisma: PrismaService) { }

    async findAll(shopId: string) {
        return this.prisma.deliveryArea.findMany({
            where: { shopId, isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(shopId: string, id: string) {
        return this.prisma.deliveryArea.findFirst({
            where: { id, shopId },
        });
    }

    async create(shopId: string, data: { name: string; polygon: any; fee?: number }) {
        return this.prisma.deliveryArea.create({
            data: {
                name: data.name,
                polygon: data.polygon,
                fee: data.fee || 0,
                shop: { connect: { id: shopId } },
            },
        });
    }

    async update(shopId: string, id: string, data: { name?: string; polygon?: any; fee?: number; isActive?: boolean }) {
        const area = await this.prisma.deliveryArea.findFirst({
            where: { id, shopId },
        });
        if (!area) return null;

        return this.prisma.deliveryArea.update({
            where: { id },
            data,
        });
    }

    async delete(shopId: string, id: string) {
        // Soft delete
        const area = await this.prisma.deliveryArea.findFirst({
            where: { id, shopId },
        });
        if (!area) return null;

        return this.prisma.deliveryArea.update({
            where: { id },
            data: { isActive: false },
        });
    }
}
