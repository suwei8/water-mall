import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

// 角色常量
export const ADMIN_ROLES = {
    SUPER_ADMIN: 'super_admin', // 超级管理员
    ADMIN: 'admin',             // 管理员
    OPERATOR: 'operator',       // 操作员
} as const;

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    /**
     * 获取管理员列表
     */
    async findAll(shopId: string, options: {
        skip?: number;
        take?: number;
        role?: string;
    } = {}) {
        const { skip = 0, take = 20, role } = options;

        const where: any = { shopId };
        if (role) {
            where.role = role;
        }

        const [admins, total] = await Promise.all([
            this.prisma.admin.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    username: true,
                    name: true,
                    mobile: true,
                    role: true,
                    isActive: true,
                    lastLoginAt: true,
                    createdAt: true,
                },
            }),
            this.prisma.admin.count({ where }),
        ]);

        return {
            data: admins,
            total,
            success: true,
        };
    }

    /**
     * 获取单个管理员
     */
    async findOne(shopId: string, id: string) {
        return this.prisma.admin.findFirst({
            where: { id, shopId },
            select: {
                id: true,
                username: true,
                name: true,
                mobile: true,
                role: true,
                isActive: true,
                lastLoginAt: true,
                createdAt: true,
            },
        });
    }

    /**
     * 通过用户名查找管理员
     */
    async findByUsername(shopId: string, username: string) {
        return this.prisma.admin.findFirst({
            where: { shopId, username },
        });
    }

    /**
     * 创建管理员
     */
    async create(shopId: string, data: {
        username: string;
        password: string;
        name?: string;
        mobile?: string;
        role?: string;
    }) {
        // 检查用户名是否已存在
        const existing = await this.findByUsername(shopId, data.username);
        if (existing) {
            throw new Error('用户名已存在');
        }

        // 密码加密
        const hashedPassword = await bcrypt.hash(data.password, 10);

        return this.prisma.admin.create({
            data: {
                shopId,
                username: data.username,
                password: hashedPassword,
                name: data.name,
                mobile: data.mobile,
                role: data.role || 'admin',
            },
            select: {
                id: true,
                username: true,
                name: true,
                mobile: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
    }

    /**
     * 更新管理员
     */
    async update(shopId: string, id: string, data: {
        name?: string;
        mobile?: string;
        role?: string;
        password?: string;
        isActive?: boolean;
    }) {
        const existing = await this.findOne(shopId, id);
        if (!existing) {
            throw new Error('管理员不存在');
        }

        const updateData: any = {
            name: data.name,
            mobile: data.mobile,
            role: data.role,
            isActive: data.isActive,
        };

        // 如果提供了新密码，加密后更新
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        return this.prisma.admin.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                username: true,
                name: true,
                mobile: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
    }

    /**
     * 删除管理员
     */
    async delete(shopId: string, id: string) {
        const existing = await this.findOne(shopId, id);
        if (!existing) {
            throw new Error('管理员不存在');
        }

        return this.prisma.admin.delete({ where: { id } });
    }

    /**
     * 验证密码
     */
    async validatePassword(admin: any, password: string): Promise<boolean> {
        return bcrypt.compare(password, admin.password);
    }

    /**
     * 更新最后登录时间
     */
    async updateLastLogin(id: string) {
        return this.prisma.admin.update({
            where: { id },
            data: { lastLoginAt: new Date() },
        });
    }
}
