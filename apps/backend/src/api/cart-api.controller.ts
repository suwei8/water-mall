import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Req,
    UseGuards,
    BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';

interface CartItem {
    productId: string;
    skuKey: string;  // SKU identifier (e.g., "颜色:红色,尺寸:L")
    quantity: number;
    price: number;
    name: string;
    image?: string;
}

/**
 * 购物车 API - 需要登录
 * 购物车数据存储在用户本地 + 服务端同步
 */
@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartApiController {
    constructor(private prisma: PrismaService) { }

    /**
     * 获取购物车
     * 注意：购物车可以用 Redis 或数据库存储
     * 这里使用简化方案：前端管理，后端仅验证
     */
    @Post('validate')
    async validateCart(@Req() req: any, @Body() body: { items: CartItem[] }) {
        const shopId = req.user.shopId;
        const { items } = body;

        if (!items || items.length === 0) {
            return { valid: true, items: [] };
        }

        // 验证商品是否存在且有效
        const productIds = [...new Set(items.map(i => i.productId))];
        const products = await this.prisma.product.findMany({
            where: {
                id: { in: productIds },
                shopId,
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                images: true,
                skus: true,
            },
        });

        const productMap = new Map(products.map(p => [p.id, p]));
        const validatedItems: any[] = [];

        for (const item of items) {
            const product = productMap.get(item.productId);
            if (!product) {
                continue; // 商品已下架，跳过
            }

            // 验证 SKU 是否存在
            const skus = product.skus as any[];
            const matchedSku = skus?.find((s: any) => s.key === item.skuKey);

            if (matchedSku) {
                validatedItems.push({
                    productId: product.id,
                    name: product.name,
                    image: product.images?.[0] || null,
                    skuKey: item.skuKey,
                    skuName: matchedSku.name || item.skuKey,
                    price: parseFloat(matchedSku.price),
                    quantity: item.quantity,
                    stock: matchedSku.stock ?? Infinity,
                    available: true,
                });
            }
        }

        return {
            valid: true,
            items: validatedItems,
        };
    }

    /**
     * 计算购物车价格
     */
    @Post('calculate')
    async calculateCart(@Req() req: any, @Body() body: { items: CartItem[] }) {
        const { items } = body;

        if (!items || items.length === 0) {
            return {
                totalAmount: 0,
                itemCount: 0,
            };
        }

        const totalAmount = items.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);

        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

        return {
            totalAmount: parseFloat(totalAmount.toFixed(2)),
            itemCount,
        };
    }
}
