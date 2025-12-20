import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) { }

    async findAll(shopId: string) {
        return this.prisma.category.findMany({
            where: { shopId },
            orderBy: { sort: 'asc' },
        });
    }

    async findOne(shopId: string, id: string) {
        return this.prisma.category.findFirst({
            where: { id, shopId },
        });
    }

    async create(shopId: string, data: { name: string; sort?: number }) {
        return this.prisma.category.create({
            data: {
                name: data.name,
                sort: data.sort || 0,
                shop: { connect: { id: shopId } },
            },
        });
    }

    async update(shopId: string, id: string, data: { name?: string; sort?: number }) {
        const category = await this.prisma.category.findFirst({
            where: { id, shopId },
        });
        if (!category) return null;

        return this.prisma.category.update({
            where: { id },
            data,
        });
    }

    async delete(shopId: string, id: string) {
        const category = await this.prisma.category.findFirst({
            where: { id, shopId },
        });
        if (!category) return null;

        return this.prisma.category.delete({
            where: { id },
        });
    }
}
