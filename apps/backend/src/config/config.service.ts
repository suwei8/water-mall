import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

// 配置分类
export const CONFIG_CATEGORIES = {
    WECHAT_MP: 'WECHAT_MP',       // 微信小程序
    WECHAT_OA: 'WECHAT_OA',       // 微信公众号
    PAYMENT: 'PAYMENT',           // 支付配置
    NOTIFICATION: 'NOTIFICATION', // 通知模板
    SHARE: 'SHARE',               // 分享设置
    BUCKET_DEPOSIT: 'BUCKET_DEPOSIT', // 押桶设置
    ORDER: 'ORDER',               // 订单设置
    POINTS: 'POINTS',             // 积分设置
} as const;

// 预定义配置项
export const CONFIG_KEYS = {
    // 微信小程序
    MP_APP_ID: { category: 'WECHAT_MP', key: 'appId', label: '小程序 AppID' },
    MP_APP_SECRET: { category: 'WECHAT_MP', key: 'appSecret', label: '小程序 AppSecret' },

    // 微信公众号
    OA_APP_ID: { category: 'WECHAT_OA', key: 'appId', label: '公众号 AppID' },
    OA_APP_SECRET: { category: 'WECHAT_OA', key: 'appSecret', label: '公众号 AppSecret' },

    // 微信支付
    MCH_ID: { category: 'PAYMENT', key: 'mchId', label: '商户号' },
    MCH_KEY: { category: 'PAYMENT', key: 'mchKey', label: '商户密钥' },
    MCH_CERT_PATH: { category: 'PAYMENT', key: 'certPath', label: '证书路径' },

    // 通知模板
    TPL_ORDER_PAID: { category: 'NOTIFICATION', key: 'orderPaid', label: '订单支付成功模板ID' },
    TPL_ORDER_DISPATCH: { category: 'NOTIFICATION', key: 'orderDispatch', label: '订单派单通知模板ID' },
    TPL_ORDER_DELIVERING: { category: 'NOTIFICATION', key: 'orderDelivering', label: '配送中通知模板ID' },
    TPL_ORDER_COMPLETED: { category: 'NOTIFICATION', key: 'orderCompleted', label: '订单完成通知模板ID' },

    // 分享设置
    SHARE_POSTER: { category: 'SHARE', key: 'poster', label: '分享海报(400x400px)' },
    SHARE_DESC: { category: 'SHARE', key: 'description', label: '分享描述' },

    // 押桶设置
    BUCKET_REQUIRED: { category: 'BUCKET_DEPOSIT', key: 'required', label: '订水是否需要押桶' },
    BUCKET_MEMBER_REQUIRED: { category: 'BUCKET_DEPOSIT', key: 'memberRequired', label: '会员订水是否需要押桶' },
    BUCKET_QUANTITY: { category: 'BUCKET_DEPOSIT', key: 'quantity', label: '押桶数量' },
    BUCKET_UNIT_PRICE: { category: 'BUCKET_DEPOSIT', key: 'unitPrice', label: '押桶押金单价' },
    BUCKET_PRODUCT_NAME: { category: 'BUCKET_DEPOSIT', key: 'productName', label: '押桶押金条名称' },
    BUCKET_PRODUCT_IMAGE: { category: 'BUCKET_DEPOSIT', key: 'productImage', label: '押桶押金条展示图片' },

    // 订单设置
    MIN_ORDER_QTY: { category: 'ORDER', key: 'minOrderQty', label: '起订量(桶)' },
    MAX_DELIVERY_DISTANCE: { category: 'ORDER', key: 'maxDeliveryDistance', label: '配送最大距离(km)' },

    // 积分设置
    POINTS_EARN_RATIO: { category: 'POINTS', key: 'earnRatio', label: '消费积分比例(消费X元得1积分)' },
    POINTS_USE_RATIO: { category: 'POINTS', key: 'useRatio', label: '积分抵扣比例(X积分抵1元)' },
    POINTS_SIGNIN_DAILY: { category: 'POINTS', key: 'signinDaily', label: '每日签到积分' },
} as const;

@Injectable()
export class ConfigService {
    constructor(private prisma: PrismaService) { }

    /**
     * 获取指定分类的所有配置
     */
    async getByCategory(shopId: string, category: string) {
        const configs = await this.prisma.systemConfig.findMany({
            where: { shopId, category },
            orderBy: { key: 'asc' },
        });

        // 转换为对象格式
        const result: Record<string, string> = {};
        configs.forEach(c => {
            result[c.key] = c.value;
        });

        return result;
    }

    /**
     * 获取所有配置（按分类分组）
     */
    async getAllConfigs(shopId: string) {
        const configs = await this.prisma.systemConfig.findMany({
            where: { shopId },
            orderBy: [{ category: 'asc' }, { key: 'asc' }],
        });

        const grouped: Record<string, Record<string, { value: string; label?: string }>> = {};

        configs.forEach(c => {
            if (!grouped[c.category]) {
                grouped[c.category] = {};
            }
            grouped[c.category][c.key] = {
                value: c.value,
                label: c.label || c.key,
            };
        });

        return grouped;
    }

    /**
     * 获取单个配置值
     */
    async get(shopId: string, category: string, key: string): Promise<string | null> {
        const config = await this.prisma.systemConfig.findUnique({
            where: {
                shopId_category_key: { shopId, category, key },
            },
        });
        return config?.value || null;
    }

    /**
     * 设置单个配置值
     */
    async set(shopId: string, category: string, key: string, value: string, label?: string) {
        return this.prisma.systemConfig.upsert({
            where: {
                shopId_category_key: { shopId, category, key },
            },
            update: { value, label },
            create: { shopId, category, key, value, label },
        });
    }

    /**
     * 批量设置配置
     */
    async setMany(shopId: string, category: string, configs: Record<string, string>) {
        const operations = Object.entries(configs).map(([key, value]) =>
            this.prisma.systemConfig.upsert({
                where: {
                    shopId_category_key: { shopId, category, key },
                },
                update: { value },
                create: { shopId, category, key, value },
            })
        );

        await this.prisma.$transaction(operations);
        return { success: true };
    }

    /**
     * 删除配置
     */
    async delete(shopId: string, category: string, key: string) {
        return this.prisma.systemConfig.delete({
            where: {
                shopId_category_key: { shopId, category, key },
            },
        });
    }

    /**
     * 获取配置模板（返回需要配置的所有项及其当前值）
     */
    async getConfigTemplate(shopId: string) {
        const allConfigs = await this.getAllConfigs(shopId);

        // 返回所有预定义配置项及其当前值
        const template: Record<string, { key: string; label: string; value: string; category: string }[]> = {
            WECHAT_MP: [],
            WECHAT_OA: [],
            PAYMENT: [],
            NOTIFICATION: [],
            SHARE: [],
            BUCKET_DEPOSIT: [],
            ORDER: [],
            POINTS: [],
        };

        Object.values(CONFIG_KEYS).forEach(config => {
            const currentValue = allConfigs[config.category]?.[config.key]?.value || '';
            template[config.category].push({
                key: config.key,
                label: config.label,
                value: currentValue,
                category: config.category,
            });
        });

        return template;
    }
}
