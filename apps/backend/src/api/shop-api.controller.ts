import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SkipShopGuard } from '../common';

/**
 * 小程序公开 API - 无需登录即可访问
 * 所有请求需要通过 shopId 参数指定店铺
 */
@Controller('shop')
@SkipShopGuard()
export class ShopApiController {
    constructor(private prisma: PrismaService) { }

    /**
     * 获取店铺信息
     */
    @Get(':shopId/info')
    async getShopInfo(@Param('shopId') shopId: string) {
        const shop = await this.prisma.shop.findUnique({
            where: { id: shopId },
            select: {
                id: true,
                name: true,
                logo: true,
            },
        });
        return shop;
    }

    /**
     * 获取店铺分类列表
     */
    @Get(':shopId/categories')
    async getCategories(@Param('shopId') shopId: string) {
        const categories = await this.prisma.category.findMany({
            where: { shopId },
            orderBy: { sort: 'asc' },
            select: {
                id: true,
                name: true,
                sort: true,
            },
        });
        return categories;
    }

    /**
     * 获取店铺商品列表
     */
    @Get(':shopId/products')
    async getProducts(
        @Param('shopId') shopId: string,
        @Query('categoryId') categoryId?: string,
        @Query('page') page?: string,
        @Query('size') size?: string,
    ) {
        const pageNum = page ? parseInt(page) : 1;
        const pageSize = size ? parseInt(size) : 20;
        const skip = (pageNum - 1) * pageSize;

        const where: any = {
            shopId,
            isActive: true,
        };

        if (categoryId) {
            where.categoryId = categoryId;
        }

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    images: true,
                    skus: true,
                    sales: true,
                    category: {
                        select: { id: true, name: true },
                    },
                },
            }),
            this.prisma.product.count({ where }),
        ]);

        // Extract first SKU price for display
        const productsWithPrice = products.map((p: any) => {
            // Parse skus - might be JSON string or array
            let skus: any[] = [];
            if (typeof p.skus === 'string') {
                try {
                    skus = JSON.parse(p.skus);
                } catch (e) {
                    skus = [];
                }
            } else if (Array.isArray(p.skus)) {
                skus = p.skus;
            }

            const minPrice = skus.length > 0
                ? Math.min(...skus.map((s: any) => parseFloat(s.price) || 0))
                : 0;

            return {
                id: p.id,
                name: p.name,
                image: p.images?.[0] || null,
                price: minPrice,
                sales: p.sales,
                categoryId: p.category?.id,
                categoryName: p.category?.name,
            };
        });

        return {
            list: productsWithPrice,
            total,
            page: pageNum,
            size: pageSize,
        };
    }

    /**
     * 获取商品详情
     */
    @Get(':shopId/products/:productId')
    async getProductDetail(
        @Param('shopId') shopId: string,
        @Param('productId') productId: string,
    ) {
        const product = await this.prisma.product.findFirst({
            where: {
                id: productId,
                shopId,
                isActive: true,
            },
            include: {
                category: {
                    select: { id: true, name: true },
                },
            },
        });
        return product;
    }
}
