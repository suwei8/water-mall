import { Controller, Get, Post, Put, Delete, Body, Req, Query, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ShopService } from './shop.service';

@Controller('shops')
@UseGuards(AuthGuard('jwt'))
export class ShopController {
    constructor(private readonly shopService: ShopService) { }

    /**
     * 获取门店列表
     */
    @Get()
    async findAll(@Query() query: {
        current?: string;
        pageSize?: string;
        name?: string;
    }) {
        const current = parseInt(query.current || '1', 10);
        const pageSize = parseInt(query.pageSize || '20', 10);
        const skip = (current - 1) * pageSize;
        return this.shopService.findAll({
            skip,
            take: pageSize,
            name: query.name,
        });
    }

    /**
     * 获取当前门店信息
     */
    @Get('current')
    async getCurrent(@Req() req: any) {
        const shopId = req.user.shopId;
        return this.shopService.findOne(shopId);
    }

    /**
     * 获取单个门店
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.shopService.findOne(id);
    }

    /**
     * 创建门店
     */
    @Post()
    async create(@Body() data: {
        name: string;
        phone?: string;
        address?: string;
        latitude?: number;
        longitude?: number;
        logo?: string;
    }) {
        const shop = await this.shopService.create(data);
        return { success: true, data: shop };
    }

    /**
     * 更新门店
     */
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: {
        name?: string;
        phone?: string;
        address?: string;
        latitude?: number;
        longitude?: number;
        logo?: string;
        isActive?: boolean;
    }) {
        const shop = await this.shopService.update(id, data);
        return { success: true, data: shop };
    }

    /**
     * 删除门店 (软删除)
     */
    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.shopService.delete(id);
        return { success: true };
    }
}

