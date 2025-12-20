import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async findAll(shopId: string, params?: {
        skip?: number;
        take?: number;
        categoryId?: string;
        search?: string;
    }) {
        const where: Prisma.ProductWhereInput = {
            shopId,
            isActive: true,
        };

        if (params?.categoryId) {
            where.categoryId = params.categoryId;
        }

        if (params?.search) {
            where.name = { contains: params.search, mode: 'insensitive' };
        }

        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip: params?.skip || 0,
                take: params?.take || 20,
                include: { category: true },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where }),
        ]);

        return { items, total };
    }

    async findOne(shopId: string, id: string) {
        return this.prisma.product.findFirst({
            where: { id, shopId },
            include: { category: true },
        });
    }

    async create(shopId: string, data: Prisma.ProductCreateInput) {
        return this.prisma.product.create({
            data: {
                ...data,
                shop: { connect: { id: shopId } },
            },
        });
    }

    async update(shopId: string, id: string, data: Prisma.ProductUpdateInput) {
        // First verify product belongs to shop
        const product = await this.prisma.product.findFirst({
            where: { id, shopId },
        });
        if (!product) return null;

        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async delete(shopId: string, id: string) {
        // Soft delete by setting isActive = false
        const product = await this.prisma.product.findFirst({
            where: { id, shopId },
        });
        if (!product) return null;

        return this.prisma.product.update({
            where: { id },
            data: { isActive: false },
        });
    }
}
