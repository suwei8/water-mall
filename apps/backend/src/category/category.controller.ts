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
import { CategoryService } from './category.service';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Get()
    async findAll(@Req() req: any) {
        const shopId = req.user.shopId;
        return this.categoryService.findAll(shopId);
    }

    @Get(':id')
    async findOne(@Req() req: any, @Param('id') id: string) {
        const shopId = req.user.shopId;
        const category = await this.categoryService.findOne(shopId, id);
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    @Post()
    async create(@Req() req: any, @Body() data: { name: string; sort?: number }) {
        const shopId = req.user.shopId;
        return this.categoryService.create(shopId, data);
    }

    @Put(':id')
    async update(
        @Req() req: any,
        @Param('id') id: string,
        @Body() data: { name?: string; sort?: number },
    ) {
        const shopId = req.user.shopId;
        const category = await this.categoryService.update(shopId, id, data);
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    @Delete(':id')
    async delete(@Req() req: any, @Param('id') id: string) {
        const shopId = req.user.shopId;
        const category = await this.categoryService.delete(shopId, id);
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return { success: true };
    }
}
