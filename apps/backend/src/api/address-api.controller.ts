import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';

interface AddressDto {
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detail: string;
    isDefault?: boolean;
}

/**
 * 收货地址 API - 需要登录
 */
@Controller('address')
@UseGuards(AuthGuard('jwt'))
export class AddressApiController {
    constructor(private prisma: PrismaService) { }

    /**
     * 获取用户地址列表
     */
    @Get()
    async getAddresses(@Req() req: any) {
        const userId = req.user.sub;

        const addresses = await this.prisma.address.findMany({
            where: { userId },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' },
            ],
        });

        return { list: addresses };
    }

    /**
     * 获取单个地址
     */
    @Get(':id')
    async getAddress(@Req() req: any, @Param('id') id: string) {
        const userId = req.user.sub;

        const address = await this.prisma.address.findFirst({
            where: { id, userId },
        });

        if (!address) {
            throw new NotFoundException('地址不存在');
        }

        return address;
    }

    /**
     * 添加地址
     */
    @Post()
    async addAddress(@Req() req: any, @Body() data: AddressDto) {
        const userId = req.user.sub;

        if (!data.name || !data.phone || !data.detail) {
            throw new BadRequestException('请填写完整地址信息');
        }

        // 如果设为默认地址，先取消其他默认
        if (data.isDefault) {
            await this.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }

        // 如果是第一个地址，自动设为默认
        const addressCount = await this.prisma.address.count({ where: { userId } });
        const isDefault = data.isDefault || addressCount === 0;

        const address = await this.prisma.address.create({
            data: {
                userId,
                name: data.name,
                phone: data.phone,
                province: data.province || '',
                city: data.city || '',
                district: data.district || '',
                detail: data.detail,
                isDefault,
            },
        });

        return address;
    }

    /**
     * 更新地址
     */
    @Put(':id')
    async updateAddress(@Req() req: any, @Param('id') id: string, @Body() data: Partial<AddressDto>) {
        const userId = req.user.sub;

        const existing = await this.prisma.address.findFirst({
            where: { id, userId },
        });

        if (!existing) {
            throw new NotFoundException('地址不存在');
        }

        // 如果设为默认地址，先取消其他默认
        if (data.isDefault) {
            await this.prisma.address.updateMany({
                where: { userId, isDefault: true, id: { not: id } },
                data: { isDefault: false },
            });
        }

        const address = await this.prisma.address.update({
            where: { id },
            data: {
                name: data.name ?? existing.name,
                phone: data.phone ?? existing.phone,
                province: data.province ?? existing.province,
                city: data.city ?? existing.city,
                district: data.district ?? existing.district,
                detail: data.detail ?? existing.detail,
                isDefault: data.isDefault ?? existing.isDefault,
            },
        });

        return address;
    }

    /**
     * 删除地址
     */
    @Delete(':id')
    async deleteAddress(@Req() req: any, @Param('id') id: string) {
        const userId = req.user.sub;

        const existing = await this.prisma.address.findFirst({
            where: { id, userId },
        });

        if (!existing) {
            throw new NotFoundException('地址不存在');
        }

        await this.prisma.address.delete({ where: { id } });

        // 如果删除的是默认地址，将最近的地址设为默认
        if (existing.isDefault) {
            const nextDefault = await this.prisma.address.findFirst({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            });
            if (nextDefault) {
                await this.prisma.address.update({
                    where: { id: nextDefault.id },
                    data: { isDefault: true },
                });
            }
        }

        return { success: true };
    }

    /**
     * 设置默认地址
     */
    @Post(':id/default')
    async setDefaultAddress(@Req() req: any, @Param('id') id: string) {
        const userId = req.user.sub;

        const existing = await this.prisma.address.findFirst({
            where: { id, userId },
        });

        if (!existing) {
            throw new NotFoundException('地址不存在');
        }

        // 取消其他默认
        await this.prisma.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false },
        });

        // 设置新默认
        await this.prisma.address.update({
            where: { id },
            data: { isDefault: true },
        });

        return { success: true };
    }
}
