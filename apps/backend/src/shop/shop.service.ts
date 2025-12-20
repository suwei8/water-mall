import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ShopService {
    constructor(private prisma: PrismaService) { }

    /**
     * 获取门店列表
     */
    async findAll(options: {
        skip?: number;
        take?: number;
        name?: string;
    } = {}) {
        const { skip = 0, take = 20, name } = options;

        const where: any = {};
        if (name) {
            where.name = { contains: name };
        }

        const [shops, total] = await Promise.all([
            this.prisma.shop.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.shop.count({ where }),
        ]);

        return {
            data: shops,
            total,
            success: true,
        };
    }

    /**
     * 获取单个门店
     */
    async findOne(shopId: string) {
        return this.prisma.shop.findUnique({
            where: { id: shopId },
        });
    }

    /**
     * 创建门店
     */
    async create(data: {
        name: string;
        phone?: string;
        address?: string;
        latitude?: number;
        longitude?: number;
        logo?: string;
    }) {
        return this.prisma.shop.create({
            data: {
                name: data.name,
                phone: data.phone,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                logo: data.logo,
            },
        });
    }

    /**
     * 更新门店
     */
    async update(shopId: string, data: {
        name?: string;
        phone?: string;
        address?: string;
        latitude?: number;
        longitude?: number;
        logo?: string;
        isActive?: boolean;
    }) {
        return this.prisma.shop.update({
            where: { id: shopId },
            data,
        });
    }

    /**
     * 删除门店
     */
    async delete(shopId: string) {
        // 软删除：设置为不活跃
        return this.prisma.shop.update({
            where: { id: shopId },
            data: { isActive: false },
        });
    }
}

