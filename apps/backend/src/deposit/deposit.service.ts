import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DepositService {
    constructor(private prisma: PrismaService) { }

    // ==================== 押金类型管理 ====================

    /**
     * 获取押金类型列表
     */
    async findAllTypes(shopId: string, options: {
        skip?: number;
        take?: number;
    } = {}) {
        const { skip = 0, take = 20 } = options;

        const [types, total] = await Promise.all([
            this.prisma.depositType.findMany({
                where: { shopId },
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { deposits: true },
                    },
                },
            }),
            this.prisma.depositType.count({ where: { shopId } }),
        ]);

        return {
            data: types.map(t => ({
                ...t,
                depositCount: t._count.deposits,
            })),
            total,
            success: true,
        };
    }

    /**
     * 创建押金类型
     */
    async createType(shopId: string, data: {
        name: string;
        amount: number;
        description?: string;
    }) {
        return this.prisma.depositType.create({
            data: {
                shopId,
                name: data.name,
                amount: data.amount,
                description: data.description || null,
            },
        });
    }

    /**
     * 更新押金类型
     */
    async updateType(shopId: string, id: string, data: any) {
        const existing = await this.prisma.depositType.findFirst({
            where: { id, shopId },
        });
        if (!existing) return null;

        return this.prisma.depositType.update({
            where: { id },
            data: {
                name: data.name ?? existing.name,
                amount: data.amount ?? existing.amount,
                description: data.description ?? existing.description,
                isActive: data.isActive ?? existing.isActive,
            },
        });
    }

    /**
     * 删除押金类型
     */
    async deleteType(shopId: string, id: string) {
        const existing = await this.prisma.depositType.findFirst({
            where: { id, shopId },
        });
        if (!existing) return null;

        // 检查是否有用户押金
        const depositCount = await this.prisma.userDeposit.count({
            where: { depositTypeId: id, status: 'HOLDING' },
        });
        if (depositCount > 0) {
            throw new BadRequestException('该押金类型有用户押金中，无法删除');
        }

        return this.prisma.depositType.delete({ where: { id } });
    }

    // ==================== 用户押金管理 ====================

    /**
     * 收取押金
     */
    async collectDeposit(userId: string, depositTypeId: string, quantity: number = 1) {
        const type = await this.prisma.depositType.findUnique({
            where: { id: depositTypeId },
        });

        if (!type || !type.isActive) {
            throw new BadRequestException('押金类型不存在或已禁用');
        }

        const totalAmount = Number(type.amount) * quantity;

        return this.prisma.userDeposit.create({
            data: {
                userId,
                depositTypeId,
                quantity,
                totalAmount,
                status: 'HOLDING',
            },
        });
    }

    /**
     * 退还押金
     */
    async returnDeposit(depositId: string) {
        const deposit = await this.prisma.userDeposit.findUnique({
            where: { id: depositId },
        });

        if (!deposit) {
            throw new BadRequestException('押金记录不存在');
        }

        if (deposit.status !== 'HOLDING') {
            throw new BadRequestException('押金已退还或已没收');
        }

        return this.prisma.userDeposit.update({
            where: { id: depositId },
            data: {
                status: 'RETURNED',
                returnedAt: new Date(),
            },
        });
    }

    /**
     * 没收押金
     */
    async forfeitDeposit(depositId: string) {
        const deposit = await this.prisma.userDeposit.findUnique({
            where: { id: depositId },
        });

        if (!deposit) {
            throw new BadRequestException('押金记录不存在');
        }

        if (deposit.status !== 'HOLDING') {
            throw new BadRequestException('押金已退还或已没收');
        }

        return this.prisma.userDeposit.update({
            where: { id: depositId },
            data: { status: 'FORFEITED' },
        });
    }

    /**
     * 获取用户押金列表
     */
    async getUserDeposits(userId: string) {
        return this.prisma.userDeposit.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                depositType: {
                    select: { name: true, amount: true },
                },
            },
        });
    }

    /**
     * 获取所有押金记录（管理后台）
     */
    async findAllDeposits(shopId: string, options: {
        skip?: number;
        take?: number;
        status?: string;
    } = {}) {
        const { skip = 0, take = 20, status } = options;

        const where: any = {
            depositType: { shopId },
        };
        if (status) {
            where.status = status;
        }

        const [deposits, total] = await Promise.all([
            this.prisma.userDeposit.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { mobile: true, name: true },
                    },
                    depositType: {
                        select: { name: true },
                    },
                },
            }),
            this.prisma.userDeposit.count({ where }),
        ]);

        return {
            data: deposits,
            total,
            success: true,
        };
    }
}
