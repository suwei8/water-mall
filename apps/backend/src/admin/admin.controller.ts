import { Controller, Get, Post, Put, Delete, Body, Req, Query, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService, ADMIN_ROLES } from './admin.service';

@Controller('admins')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    /**
     * 获取管理员列表
     */
    @Get()
    async findAll(@Req() req: any, @Query() query: {
        current?: number;
        pageSize?: number;
        role?: string;
    }) {
        const shopId = req.user.shopId;
        const current = query.current ? Number(query.current) : 1;
        const pageSize = query.pageSize ? Number(query.pageSize) : 20;
        const skip = (current - 1) * pageSize;
        try {
            return await this.adminService.findAll(shopId, {
                skip,
                take: pageSize,
                role: query.role,
            });
        } catch (e: any) {
            throw new HttpException(e.message || '获取管理员列表失败', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 获取角色选项
     */
    @Get('roles')
    async getRoles() {
        return {
            data: [
                { label: '超级管理员', value: ADMIN_ROLES.SUPER_ADMIN },
                { label: '管理员', value: ADMIN_ROLES.ADMIN },
                { label: '操作员', value: ADMIN_ROLES.OPERATOR },
            ],
        };
    }

    /**
     * 获取单个管理员
     */
    @Get(':id')
    async findOne(@Req() req: any, @Param('id') id: string) {
        const shopId = req.user.shopId;
        const admin = await this.adminService.findOne(shopId, id);
        if (!admin) {
            throw new HttpException('管理员不存在', HttpStatus.NOT_FOUND);
        }
        return admin;
    }

    /**
     * 创建管理员
     */
    @Post()
    async create(@Req() req: any, @Body() data: {
        username: string;
        password: string;
        name?: string;
        mobile?: string;
        role?: string;
    }) {
        const shopId = req.user.shopId;
        try {
            const admin = await this.adminService.create(shopId, data);
            return { success: true, data: admin };
        } catch (e: any) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 更新管理员
     */
    @Put(':id')
    async update(@Req() req: any, @Param('id') id: string, @Body() data: {
        name?: string;
        mobile?: string;
        role?: string;
        password?: string;
        isActive?: boolean;
    }) {
        const shopId = req.user.shopId;
        try {
            const admin = await this.adminService.update(shopId, id, data);
            return { success: true, data: admin };
        } catch (e: any) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 删除管理员
     */
    @Delete(':id')
    async delete(@Req() req: any, @Param('id') id: string) {
        const shopId = req.user.shopId;
        try {
            await this.adminService.delete(shopId, id);
            return { success: true };
        } catch (e: any) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }
}
