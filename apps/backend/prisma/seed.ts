import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
    // 1. Create Default Shop with full details
    const shop = await prisma.shop.upsert({
        where: { id: 'default-shop' },
        update: { phone: '028-88886666', address: '成都市武侯区科华北路88号', latitude: 30.6280, longitude: 104.0650 },
        create: {
            id: 'default-shop',
            name: '优选送水站',
            phone: '028-88886666',
            address: '成都市武侯区科华北路88号',
            latitude: 30.6280,
            longitude: 104.0650,
        },
    });
    console.log('Shop created:', shop.name);

    // 2. Create Admin User (Legacy support for User table)
    const adminUser = await prisma.user.upsert({
        where: { shopId_mobile: { shopId: shop.id, mobile: '13800138000' } },
        update: { role: 'super_admin' },
        create: {
            shopId: shop.id,
            mobile: '13800138000',
            name: 'Admin',
            password: 'sw63828', // Legacy plaintext
            balance: 0,
            points: 500,
            role: 'super_admin',
        },
    });
    console.log('Admin User created:', adminUser.name);

    // 2.1 Create Admin Record (For Admin Panel Auth)
    const hashedPassword = await bcrypt.hash('sw63828', 10);
    const admin = await prisma.admin.upsert({
        where: { shopId_username: { shopId: shop.id, username: 'admin' } },
        update: { password: hashedPassword, role: 'super_admin' },
        create: {
            shopId: shop.id,
            username: 'admin',
            password: hashedPassword,
            name: 'Super Admin',
            mobile: '13800138000',
            role: 'super_admin',
        },
    });
    console.log('Admin Record created:', admin.username);

    // 3. Create Demo Customers (20 test users)
    const customerData = [
        { mobile: '13512345678', name: '张三', balance: 100, points: 200 },
        { mobile: '13612345678', name: '李四', balance: 50, points: 150 },
        { mobile: '13712345678', name: '王五', balance: 200, points: 800 },
        { mobile: '13812345678', name: '赵六', balance: 0, points: 50 },
        { mobile: '13900001001', name: '陈小明', balance: 350, points: 1200 },
        { mobile: '13900001002', name: '刘芳芳', balance: 88, points: 560 },
        { mobile: '13900001003', name: '周大勇', balance: 500, points: 2500 },
        { mobile: '13900001004', name: '吴秀英', balance: 120, points: 380 },
        { mobile: '13900001005', name: '郑建国', balance: 0, points: 100 },
        { mobile: '13900001006', name: '孙丽丽', balance: 280, points: 950 },
        { mobile: '13900001007', name: '钱伟', balance: 45, points: 200 },
        { mobile: '13900001008', name: '李梅', balance: 600, points: 3000 },
        { mobile: '13900001009', name: '王强', balance: 0, points: 0 },
        { mobile: '13900001010', name: '张敏', balance: 150, points: 720 },
        { mobile: '13900001011', name: '赵阳', balance: 320, points: 1500 },
        { mobile: '13900001012', name: '刘洋', balance: 75, points: 280 },
        { mobile: '13900001013', name: '陈燕', balance: 450, points: 1800 },
        { mobile: '13900001014', name: '杨军', balance: 0, points: 50 },
        { mobile: '13900001015', name: '黄霞', balance: 200, points: 600 },
        { mobile: '13900001016', name: '王浩', balance: 1000, points: 5000 },
    ];

    const customers = await Promise.all(
        customerData.map(c =>
            prisma.user.upsert({
                where: { shopId_mobile: { shopId: shop.id, mobile: c.mobile } },
                update: {},
                create: { shopId: shop.id, mobile: c.mobile, name: c.name, password: '123456', balance: c.balance, points: c.points },
            })
        )
    );
    console.log('Customers created:', customers.length);

    // 4. Create Addresses for Customers
    const addresses = await Promise.all([
        prisma.address.upsert({
            where: { id: 'addr-1' }, update: {},
            create: { id: 'addr-1', userId: customers[0].id, name: '张三', phone: '13512345678', province: '四川省', city: '成都市', district: '锦江区', detail: '春熙路100号', isDefault: true },
        }),
        prisma.address.upsert({
            where: { id: 'addr-2' }, update: {},
            create: { id: 'addr-2', userId: customers[1].id, name: '李四', phone: '13612345678', province: '四川省', city: '成都市', district: '青羊区', detail: '人民西路50号', isDefault: true },
        }),
        prisma.address.upsert({
            where: { id: 'addr-3' }, update: {},
            create: { id: 'addr-3', userId: customers[2].id, name: '王五', phone: '13712345678', province: '四川省', city: '成都市', district: '高新区', detail: '天府大道666号', isDefault: true },
        }),
    ]);
    console.log('Addresses created:', addresses.length);

    // 5. Create Categories
    const categories = await Promise.all([
        prisma.category.upsert({ where: { id: 'cat-water' }, update: {}, create: { id: 'cat-water', shopId: shop.id, name: '桶装水', sort: 1 } }),
        prisma.category.upsert({ where: { id: 'cat-mineral' }, update: {}, create: { id: 'cat-mineral', shopId: shop.id, name: '矿泉水', sort: 2 } }),
        prisma.category.upsert({ where: { id: 'cat-drinks' }, update: {}, create: { id: 'cat-drinks', shopId: shop.id, name: '饮料', sort: 3 } }),
    ]);
    console.log('Categories created:', categories.map(c => c.name));

    // 6. Create Products
    const products = await Promise.all([
        prisma.product.upsert({
            where: { id: 'prod-1' }, update: {},
            create: { id: 'prod-1', shopId: shop.id, categoryId: 'cat-water', name: '农夫山泉桶装水 18.9L', description: '天然矿泉水', images: ['https://img.yzcdn.cn/vant/apple-1.jpg'], specs: JSON.stringify([{ name: '规格', options: ['18.9L'] }]), skus: JSON.stringify([{ spec: '18.9L', price: 18, stock: 999 }]), sales: 1520 },
        }),
        prisma.product.upsert({
            where: { id: 'prod-2' }, update: {},
            create: { id: 'prod-2', shopId: shop.id, categoryId: 'cat-water', name: '怡宝纯净水 18.9L', description: '纯净健康', images: ['https://img.yzcdn.cn/vant/apple-2.jpg'], specs: JSON.stringify([{ name: '规格', options: ['18.9L'] }]), skus: JSON.stringify([{ spec: '18.9L', price: 16, stock: 999 }]), sales: 980 },
        }),
        prisma.product.upsert({
            where: { id: 'prod-3' }, update: {},
            create: { id: 'prod-3', shopId: shop.id, categoryId: 'cat-mineral', name: '农夫山泉矿泉水 550ml*24瓶', description: '便携装', images: ['https://img.yzcdn.cn/vant/apple-3.jpg'], specs: JSON.stringify([{ name: '包装', options: ['24瓶装'] }]), skus: JSON.stringify([{ spec: '24瓶装', price: 48, stock: 200 }]), sales: 2350 },
        }),
        prisma.product.upsert({
            where: { id: 'prod-4' }, update: {},
            create: { id: 'prod-4', shopId: shop.id, categoryId: 'cat-drinks', name: '可口可乐 330ml*24罐', description: '经典口味', images: ['https://img.yzcdn.cn/vant/apple-4.jpg'], specs: JSON.stringify([{ name: '包装', options: ['24罐装'] }]), skus: JSON.stringify([{ spec: '24罐装', price: 58, stock: 150 }]), sales: 680 },
        }),
    ]);
    console.log('Products created:', products.length);

    // 7. Create Delivery Areas
    await Promise.all([
        prisma.deliveryArea.upsert({ where: { id: 'area-1' }, update: {}, create: { id: 'area-1', shopId: shop.id, name: '市中心配送区', polygon: '[]', fee: 0 } }),
        prisma.deliveryArea.upsert({ where: { id: 'area-2' }, update: {}, create: { id: 'area-2', shopId: shop.id, name: '郊区配送区', polygon: '[]', fee: 5 } }),
    ]);
    console.log('Delivery areas created');

    // 8. Create Coupons
    const coupons = await Promise.all([
        prisma.coupon.upsert({
            where: { id: 'coupon-1' }, update: {},
            create: { id: 'coupon-1', shopId: shop.id, name: '新用户满减券', category: 'NORMAL', type: 'FULL_REDUCTION', value: 10, minSpend: 50, quota: 100, issuedCount: 23, useStartAt: new Date(), useEndAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true },
        }),
        prisma.coupon.upsert({
            where: { id: 'coupon-2' }, update: {},
            create: { id: 'coupon-2', shopId: shop.id, name: '双十一特惠券', category: 'NORMAL', type: 'DISCOUNT', value: 20, minSpend: 100, quota: 200, issuedCount: 156, useStartAt: new Date(), useEndAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), isActive: true },
        }),
        prisma.coupon.upsert({
            where: { id: 'coupon-3' }, update: {},
            create: { id: 'coupon-3', shopId: shop.id, name: '新人首单券', category: 'NEW_USER', type: 'FULL_REDUCTION', value: 5, minSpend: 0, quota: 500, issuedCount: 89, useStartAt: new Date(), useEndAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), isActive: true },
        }),
    ]);
    console.log('Coupons created:', coupons.length);

    // 9. Create Water Tickets
    const waterTickets = await Promise.all([
        prisma.waterTicket.upsert({
            where: { id: 'ticket-1' }, update: {},
            create: { id: 'ticket-1', shopId: shop.id, name: '10桶水票', quantity: 10, price: 160, originalPrice: 180, isActive: true },
        }),
        prisma.waterTicket.upsert({
            where: { id: 'ticket-2' }, update: {},
            create: { id: 'ticket-2', shopId: shop.id, name: '20桶水票', quantity: 20, price: 300, originalPrice: 360, isActive: true },
        }),
        prisma.waterTicket.upsert({
            where: { id: 'ticket-3' }, update: {},
            create: { id: 'ticket-3', shopId: shop.id, name: '50桶水票', quantity: 50, price: 700, originalPrice: 900, isActive: true },
        }),
    ]);
    console.log('Water tickets created:', waterTickets.length);

    // 10. Give customers some water tickets
    await Promise.all([
        prisma.userWaterTicket.upsert({
            where: { id: 'uwt-1' }, update: {},
            create: { id: 'uwt-1', userId: customers[0].id, ticketId: 'ticket-1', remaining: 8, expireAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
        }),
        prisma.userWaterTicket.upsert({
            where: { id: 'uwt-2' }, update: {},
            create: { id: 'uwt-2', userId: customers[2].id, ticketId: 'ticket-2', remaining: 15, expireAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
        }),
    ]);
    console.log('User water tickets created');

    // 11. Create Deposit Types
    const depositTypes = await Promise.all([
        prisma.depositType.upsert({
            where: { id: 'dep-type-1' }, update: {},
            create: { id: 'dep-type-1', shopId: shop.id, name: '标准桶押金', amount: 30, description: '18.9L标准桶押金' },
        }),
        prisma.depositType.upsert({
            where: { id: 'dep-type-2' }, update: {},
            create: { id: 'dep-type-2', shopId: shop.id, name: '大桶押金', amount: 50, description: '20L及以上大桶押金' },
        }),
    ]);
    console.log('Deposit types created:', depositTypes.length);

    // 12. Create User Deposits
    await Promise.all([
        prisma.userDeposit.upsert({
            where: { id: 'ud-1' }, update: {},
            create: { id: 'ud-1', userId: customers[0].id, depositTypeId: 'dep-type-1', quantity: 2, totalAmount: 60, status: 'HOLDING' },
        }),
        prisma.userDeposit.upsert({
            where: { id: 'ud-2' }, update: {},
            create: { id: 'ud-2', userId: customers[2].id, depositTypeId: 'dep-type-1', quantity: 3, totalAmount: 90, status: 'HOLDING' },
        }),
    ]);
    console.log('User deposits created');

    // 13. Create Dispatchers
    const dispatchers = await Promise.all([
        prisma.dispatcher.upsert({
            where: { shopId_phone: { shopId: shop.id, phone: '13900001111' } }, update: {},
            create: { id: 'disp-1', shopId: shop.id, name: '张师傅', phone: '13900001111', status: 'ACTIVE' },
        }),
        prisma.dispatcher.upsert({
            where: { shopId_phone: { shopId: shop.id, phone: '13900002222' } }, update: {},
            create: { id: 'disp-2', shopId: shop.id, name: '李师傅', phone: '13900002222', status: 'ACTIVE' },
        }),
        prisma.dispatcher.upsert({
            where: { shopId_phone: { shopId: shop.id, phone: '13900003333' } }, update: {},
            create: { id: 'disp-3', shopId: shop.id, name: '王师傅', phone: '13900003333', status: 'INACTIVE' },
        }),
    ]);
    console.log('Dispatchers created:', dispatchers.length);

    // 14. Create Demo Orders
    const orders = await Promise.all([
        prisma.order.upsert({
            where: { id: 'order-1' }, update: {},
            create: {
                id: 'order-1', shopId: shop.id, userId: customers[0].id,
                items: JSON.stringify([{ productId: 'prod-1', name: '农夫山泉桶装水 18.9L', price: 18, quantity: 3, contactName: '张三', contactPhone: '13512345678', address: '成都市锦江区春熙路100号' }]),
                totalAmount: 54, payAmount: 54, status: 'COMPLETED',
            },
        }),
        prisma.order.upsert({
            where: { id: 'order-2' }, update: {},
            create: {
                id: 'order-2', shopId: shop.id, userId: customers[1].id,
                items: JSON.stringify([{ productId: 'prod-2', name: '怡宝纯净水 18.9L', price: 16, quantity: 5, contactName: '李四', contactPhone: '13612345678', address: '成都市青羊区人民西路50号' }]),
                totalAmount: 80, payAmount: 70, status: 'DELIVERING',
            },
        }),
        prisma.order.upsert({
            where: { id: 'order-3' }, update: {},
            create: {
                id: 'order-3', shopId: shop.id, userId: customers[2].id,
                items: JSON.stringify([{ productId: 'prod-1', name: '农夫山泉桶装水 18.9L', price: 18, quantity: 10, contactName: '王五', contactPhone: '13712345678', address: '成都市高新区天府大道666号' }]),
                totalAmount: 180, payAmount: 160, status: 'PAID',
            },
        }),
        prisma.order.upsert({
            where: { id: 'order-4' }, update: {},
            create: {
                id: 'order-4', shopId: shop.id, userId: customers[0].id,
                items: JSON.stringify([{ productId: 'prod-3', name: '农夫山泉矿泉水 550ml*24瓶', price: 48, quantity: 2, contactName: '张三', contactPhone: '13512345678', address: '成都市锦江区春熙路100号' }]),
                totalAmount: 96, payAmount: 96, status: 'PENDING',
            },
        }),
    ]);
    console.log('Orders created:', orders.length);

    // 15. Create Order Dispatches
    await Promise.all([
        prisma.orderDispatch.upsert({
            where: { id: 'od-1' }, update: {},
            create: { id: 'od-1', orderId: 'order-1', dispatcherId: 'disp-1', status: 'COMPLETED' },
        }),
        prisma.orderDispatch.upsert({
            where: { id: 'od-2' }, update: {},
            create: { id: 'od-2', orderId: 'order-2', dispatcherId: 'disp-2', status: 'IN_PROGRESS' },
        }),
    ]);
    console.log('Order dispatches created');

    // 16. Create System Configs
    await Promise.all([
        prisma.systemConfig.upsert({ where: { shopId_category_key: { shopId: shop.id, category: 'SHARE', key: 'description' } }, update: {}, create: { shopId: shop.id, category: 'SHARE', key: 'description', value: '订水无忧，方便到家', label: '分享描述' } }),
        prisma.systemConfig.upsert({ where: { shopId_category_key: { shopId: shop.id, category: 'BUCKET_DEPOSIT', key: 'required' } }, update: {}, create: { shopId: shop.id, category: 'BUCKET_DEPOSIT', key: 'required', value: 'true', label: '订水是否需要押桶' } }),
        prisma.systemConfig.upsert({ where: { shopId_category_key: { shopId: shop.id, category: 'BUCKET_DEPOSIT', key: 'memberRequired' } }, update: {}, create: { shopId: shop.id, category: 'BUCKET_DEPOSIT', key: 'memberRequired', value: 'false', label: '会员订水是否需要押桶' } }),
        prisma.systemConfig.upsert({ where: { shopId_category_key: { shopId: shop.id, category: 'BUCKET_DEPOSIT', key: 'quantity' } }, update: {}, create: { shopId: shop.id, category: 'BUCKET_DEPOSIT', key: 'quantity', value: '1', label: '押桶数量' } }),
        prisma.systemConfig.upsert({ where: { shopId_category_key: { shopId: shop.id, category: 'BUCKET_DEPOSIT', key: 'unitPrice' } }, update: {}, create: { shopId: shop.id, category: 'BUCKET_DEPOSIT', key: 'unitPrice', value: '30', label: '押桶押金单价' } }),
        prisma.systemConfig.upsert({ where: { shopId_category_key: { shopId: shop.id, category: 'BUCKET_DEPOSIT', key: 'productName' } }, update: {}, create: { shopId: shop.id, category: 'BUCKET_DEPOSIT', key: 'productName', value: '桶押金', label: '押桶押金条名称' } }),
        prisma.systemConfig.upsert({ where: { shopId_category_key: { shopId: shop.id, category: 'ORDER', key: 'minOrderQty' } }, update: {}, create: { shopId: shop.id, category: 'ORDER', key: 'minOrderQty', value: '2', label: '起订量(桶)' } }),
        prisma.systemConfig.upsert({ where: { shopId_category_key: { shopId: shop.id, category: 'ORDER', key: 'maxDeliveryDistance' } }, update: {}, create: { shopId: shop.id, category: 'ORDER', key: 'maxDeliveryDistance', value: '10', label: '配送最大距离(km)' } }),
        prisma.systemConfig.upsert({ where: { shopId_category_key: { shopId: shop.id, category: 'POINTS', key: 'earnRatio' } }, update: {}, create: { shopId: shop.id, category: 'POINTS', key: 'earnRatio', value: '10', label: '消费积分比例' } }),
        prisma.systemConfig.upsert({ where: { shopId_category_key: { shopId: shop.id, category: 'POINTS', key: 'useRatio' } }, update: {}, create: { shopId: shop.id, category: 'POINTS', key: 'useRatio', value: '100', label: '积分抵扣比例' } }),
        prisma.systemConfig.upsert({ where: { shopId_category_key: { shopId: shop.id, category: 'POINTS', key: 'signinDaily' } }, update: {}, create: { shopId: shop.id, category: 'POINTS', key: 'signinDaily', value: '5', label: '每日签到积分' } }),
    ]);
    console.log('System configs created');

    // 17. Create Second Shop
    const shop2 = await prisma.shop.upsert({
        where: { id: 'shop-2' },
        update: {},
        create: { id: 'shop-2', name: '清泉水站', phone: '028-88887777', address: '成都市金牛区一品天下大街200号' },
    });
    const admin2 = await prisma.user.upsert({
        where: { shopId_mobile: { shopId: shop2.id, mobile: '13900139000' } },
        update: {},
        create: { shopId: shop2.id, mobile: '13900139000', name: 'Admin2', password: 'test1234' },
    });
    console.log('Shop2 and Admin2 created');

    console.log('\n✅ All demo data created successfully!');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });

