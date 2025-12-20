import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    Req,
    UseGuards,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';

interface OrderItem {
    productId: string;
    skuKey: string;
    quantity: number;
    price: number;
    name: string;
    image?: string;
}

interface CreateOrderDto {
    items: OrderItem[];
    addressId?: string;
    address?: {
        name: string;
        phone: string;
        province: string;
        city: string;
        district: string;
        detail: string;
    };
    remark?: string;
}

/**
 * 订单 API - 需要登录
 */
@Controller('user-orders')
@UseGuards(AuthGuard('jwt'))
export class OrderApiController {
    constructor(private prisma: PrismaService) { }

    /**
     * 创建订单
     */
    @Post()
    async createOrder(@Req() req: any, @Body() data: CreateOrderDto) {
        const userId = req.user.sub;
        const shopId = req.user.shopId;

        if (!data.items || data.items.length === 0) {
            throw new BadRequestException('订单商品不能为空');
        }

        if (!data.address && !data.addressId) {
            throw new BadRequestException('请选择收货地址');
        }

        // 计算订单金额
        const totalAmount = data.items.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);

        // 创建订单
        const order = await this.prisma.order.create({
            data: {
                shopId,
                userId,
                status: 'PENDING',
                totalAmount,
                payAmount: totalAmount, // 暂不计算优惠
                items: data.items as any,
                dispatchInfo: data.address ? {
                    address: data.address,
                    remark: data.remark || '',
                } : undefined,
            },
        });

        return {
            orderId: order.id,
            totalAmount: order.totalAmount,
            status: order.status,
        };
    }

    /**
     * 获取订单列表
     */
    @Get()
    async getOrders(
        @Req() req: any,
        @Query('status') status?: string,
        @Query('page') page?: string,
        @Query('size') size?: string,
    ) {
        const userId = req.user.sub;
        const shopId = req.user.shopId;
        const pageNum = page ? parseInt(page) : 1;
        const pageSize = size ? parseInt(size) : 10;
        const skip = (pageNum - 1) * pageSize;

        const where: any = { userId, shopId };
        if (status) {
            where.status = status;
        }

        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    status: true,
                    totalAmount: true,
                    payAmount: true,
                    items: true,
                    createdAt: true,
                },
            }),
            this.prisma.order.count({ where }),
        ]);

        return {
            list: orders,
            total,
            page: pageNum,
            size: pageSize,
        };
    }

    /**
     * 获取订单详情
     */
    @Get(':id')
    async getOrderDetail(@Req() req: any, @Param('id') id: string) {
        const userId = req.user.sub;
        const shopId = req.user.shopId;

        const order = await this.prisma.order.findFirst({
            where: { id, userId, shopId },
        });

        if (!order) {
            throw new NotFoundException('订单不存在');
        }

        return order;
    }

    /**
     * 取消订单
     */
    @Post(':id/cancel')
    async cancelOrder(@Req() req: any, @Param('id') id: string) {
        const userId = req.user.sub;
        const shopId = req.user.shopId;

        const order = await this.prisma.order.findFirst({
            where: { id, userId, shopId },
        });

        if (!order) {
            throw new NotFoundException('订单不存在');
        }

        if (order.status !== 'PENDING') {
            throw new BadRequestException('只能取消待支付订单');
        }

        await this.prisma.order.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });

        return { success: true };
    }
}
