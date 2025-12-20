import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Req,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DeliveryAreaService } from './delivery-area.service';

@Controller('delivery-areas')
@UseGuards(AuthGuard('jwt'))
export class DeliveryAreaController {
    constructor(private readonly deliveryAreaService: DeliveryAreaService) { }

    @Get()
    async findAll(@Req() req: any) {
        const shopId = req.user.shopId;
        return this.deliveryAreaService.findAll(shopId);
    }

    @Get(':id')
    async findOne(@Req() req: any, @Param('id') id: string) {
        const shopId = req.user.shopId;
        const area = await this.deliveryAreaService.findOne(shopId, id);
        if (!area) {
            throw new NotFoundException('Delivery area not found');
        }
        return area;
    }

    @Post()
    async create(@Req() req: any, @Body() data: { name: string; polygon: any; fee?: number }) {
        const shopId = req.user.shopId;
        return this.deliveryAreaService.create(shopId, data);
    }

    @Put(':id')
    async update(
        @Req() req: any,
        @Param('id') id: string,
        @Body() data: { name?: string; polygon?: any; fee?: number; isActive?: boolean },
    ) {
        const shopId = req.user.shopId;
        const area = await this.deliveryAreaService.update(shopId, id, data);
        if (!area) {
            throw new NotFoundException('Delivery area not found');
        }
        return area;
    }

    @Delete(':id')
    async delete(@Req() req: any, @Param('id') id: string) {
        const shopId = req.user.shopId;
        const area = await this.deliveryAreaService.delete(shopId, id);
        if (!area) {
            throw new NotFoundException('Delivery area not found');
        }
        return { success: true };
    }
}
