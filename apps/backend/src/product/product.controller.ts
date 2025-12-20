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
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductService } from './product.service';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    async findAll(
        @Req() req: any,
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('categoryId') categoryId?: string,
        @Query('search') search?: string,
    ) {
        const shopId = req.user.shopId;
        return this.productService.findAll(shopId, {
            skip: skip ? parseInt(skip) : undefined,
            take: take ? parseInt(take) : undefined,
            categoryId,
            search,
        });
    }

    @Get(':id')
    async findOne(@Req() req: any, @Param('id') id: string) {
        const shopId = req.user.shopId;
        const product = await this.productService.findOne(shopId, id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    @Post()
    async create(@Req() req: any, @Body() data: any) {
        const shopId = req.user.shopId;
        return this.productService.create(shopId, data);
    }

    @Put(':id')
    async update(
        @Req() req: any,
        @Param('id') id: string,
        @Body() data: any,
    ) {
        const shopId = req.user.shopId;
        const product = await this.productService.update(shopId, id, data);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    @Delete(':id')
    async delete(@Req() req: any, @Param('id') id: string) {
        const shopId = req.user.shopId;
        const product = await this.productService.delete(shopId, id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return { success: true };
    }
}
