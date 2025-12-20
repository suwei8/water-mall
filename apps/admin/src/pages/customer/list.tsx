import React, { useRef, useState } from 'react';
import { PageContainer, ProTable, ProDescriptions, ModalForm, ProFormText, ProFormDatePicker, ProFormDigit, ProFormTextArea, ProFormSelect } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Drawer, Tag, Tabs, Button, message, Space, Card, Statistic, Row, Col } from 'antd';
import { PlusOutlined, ExportOutlined, ImportOutlined, WalletOutlined, GiftOutlined, CreditCardOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 配置 dayjs 使用中国时区
dayjs.extend(utc);
dayjs.extend(timezone);

const formatChinaTime = (date: string) => dayjs(date).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');

interface CustomerItem {
    id: string;
    mobile: string;
    name?: string;
    nickname?: string;
    balance: number;
    points: number;
    orderCount: number;
    couponCount?: number;
    depositCount?: number;
    ticketCount?: number;
    createdAt: string;
}

interface OrderItem {
    id: string;
    status: string;
    totalAmount: number;
    payAmount: number;
    items: any;
    createdAt: string;
}

interface RecordItem {
    id: string;
    type: string;
    amount: number;
    balance: number;
    remark?: string;
    createdAt: string;
}

interface UserCouponItem {
    id: string;
    status: string;
    createdAt: string;
    coupon: {
        id: string;
        name: string;
        type: string;
        value: number;
        minSpend: number;
        useStartAt?: string;
        useEndAt?: string;
    };
}

interface DepositItem {
    id: string;
    userId: string;
    userName?: string;
    userMobile?: string;
    depositType: string;
    quantity: number;
    totalAmount: number;
    status: string;
    createdAt: string;
}

const statusColors: Record<string, string> = {
    PENDING: 'orange',
    PAID: 'green',
    DISPATCHED: 'blue',
    DELIVERING: 'cyan',
    COMPLETED: 'default',
    CANCELLED: 'red',
    HOLDING: 'blue',
    RETURNED: 'green',
    FORFEITED: 'red',
    UNUSED: 'green',
    USED: 'default',
    EXPIRED: 'red',
};

const typeLabels: Record<string, string> = {
    RECHARGE: '充值',
    CONSUME: '消费',
    REFUND: '退款',
    GIFT: '赠送',
    EARN: '获取',
    SIGNIN: '签到',
    FULL_REDUCTION: '满减券',
    DISCOUNT: '折扣券',
};

const CustomerList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [activeTab, setActiveTab] = useState('members');
    const [currentUser, setCurrentUser] = useState<CustomerItem | null>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [detailTab, setDetailTab] = useState('orders');
    const [rechargeModalVisible, setRechargeModalVisible] = useState(false);
    const [giftPointsModalVisible, setGiftPointsModalVisible] = useState(false);
    const [issueCouponModalVisible, setIssueCouponModalVisible] = useState(false);

    // 会员列表列
    const memberColumns: ProColumns<CustomerItem>[] = [
        {
            title: '会员编号',
            dataIndex: 'id',
            width: 100,
            render: (_, record) => record.id.slice(0, 8),
            search: false,
        },
        {
            title: '会员',
            dataIndex: 'name',
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{record.name || record.nickname || '未设置'}</div>
                    <div style={{ color: '#999', fontSize: 12 }}>{record.mobile}</div>
                </div>
            ),
        },
        {
            title: '手机号',
            dataIndex: 'mobile',
            hideInTable: true,
        },
        {
            title: '账户余额',
            dataIndex: 'balance',
            search: false,
            render: (_, record) => <span style={{ color: '#52c41a' }}>¥{Number(record.balance).toFixed(2)}</span>,
        },
        {
            title: '可用积分',
            dataIndex: 'points',
            search: false,
        },
        {
            title: '欠桶',
            dataIndex: 'depositCount',
            search: false,
            render: (_, record) => record.depositCount || 0,
        },
        {
            title: '水票数量',
            dataIndex: 'ticketCount',
            search: false,
            render: (_, record) => record.ticketCount || 0,
        },
        {
            title: '注册时间',
            dataIndex: 'createdAt',
            search: false,
            render: (_, record) => formatChinaTime(record.createdAt),
        },
        {
            title: '操作',
            valueType: 'option',
            width: 150,
            render: (_, record) => [
                <a key="detail" onClick={() => viewDetail(record)}>详情</a>,
                <a key="recharge" onClick={() => { setCurrentUser(record); setRechargeModalVisible(true); }}>充值</a>,
            ],
        },
    ];

    // 订单记录列
    const orderColumns: ProColumns<OrderItem>[] = [
        { title: '订单编号', dataIndex: 'id', width: 100, render: (_, r) => r.id.slice(0, 8) },
        { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
        { title: '订单金额', dataIndex: 'totalAmount', render: (a: number) => `¥${Number(a).toFixed(2)}` },
        { title: '实付金额', dataIndex: 'payAmount', render: (a: number) => `¥${Number(a).toFixed(2)}` },
        { title: '下单时间', dataIndex: 'createdAt', render: (_, r) => formatChinaTime(r.createdAt) },
    ];

    // 余额记录列
    const balanceRecordColumns: ProColumns<RecordItem>[] = [
        { title: '变动类型', dataIndex: 'type', render: (t: string) => <Tag>{typeLabels[t] || t}</Tag> },
        { title: '变动金额', dataIndex: 'amount', render: (a: number) => <span style={{ color: Number(a) > 0 ? '#52c41a' : '#ff4d4f' }}>¥{Number(a) > 0 ? '+' : ''}{Number(a).toFixed(2)}</span> },
        { title: '变动后余额', dataIndex: 'balance', render: (b: number) => `¥${Number(b).toFixed(2)}` },
        { title: '备注', dataIndex: 'remark', ellipsis: true },
        { title: '时间', dataIndex: 'createdAt', render: (_, r) => formatChinaTime(r.createdAt) },
    ];

    // 积分记录列
    const pointsRecordColumns: ProColumns<RecordItem>[] = [
        { title: '变动类型', dataIndex: 'type', render: (t: string) => <Tag>{typeLabels[t] || t}</Tag> },
        { title: '变动积分', dataIndex: 'amount', render: (a: number) => <span style={{ color: Number(a) > 0 ? '#52c41a' : '#ff4d4f' }}>{Number(a) > 0 ? '+' : ''}{a}</span> },
        { title: '变动后积分', dataIndex: 'balance' },
        { title: '备注', dataIndex: 'remark', ellipsis: true },
        { title: '时间', dataIndex: 'createdAt', render: (_, r) => formatChinaTime(r.createdAt) },
    ];

    // 优惠券记录列
    const couponRecordColumns: ProColumns<UserCouponItem>[] = [
        { title: '优惠券名称', dataIndex: ['coupon', 'name'] },
        { title: '类型', dataIndex: ['coupon', 'type'], render: (t: string) => <Tag>{typeLabels[t] || t}</Tag> },
        { title: '优惠金额/折扣', dataIndex: ['coupon', 'value'], render: (v: number, r) => r.coupon.type === 'DISCOUNT' ? `${v}折` : `¥${v}` },
        { title: '使用门槛', dataIndex: ['coupon', 'minSpend'], render: (v: number) => v > 0 ? `满¥${v}可用` : '无门槛' },
        { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s === 'UNUSED' ? '未使用' : s === 'USED' ? '已使用' : '已过期'}</Tag> },
        { title: '领取时间', dataIndex: 'createdAt', render: (_, r) => formatChinaTime(r.createdAt) },
    ];

    // 会员押金列
    const depositColumns: ProColumns<DepositItem>[] = [
        { title: '会员', dataIndex: 'userName' },
        { title: '手机号', dataIndex: 'userMobile' },
        { title: '押金类型', dataIndex: 'depositType' },
        { title: '数量', dataIndex: 'quantity' },
        { title: '押金金额', dataIndex: 'totalAmount', render: (a: number) => `¥${a}` },
        { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s === 'HOLDING' ? '持有中' : s === 'RETURNED' ? '已退还' : '已没收'}</Tag> },
        { title: '创建时间', dataIndex: 'createdAt', render: (_, r) => formatChinaTime(r.createdAt) },
        {
            title: '操作',
            valueType: 'option',
            render: (_, record) => record.status === 'HOLDING' ? [
                <a key="return" onClick={() => message.info('退还功能开发中')}>退还</a>,
            ] : '-',
        },
    ];

    const viewDetail = async (user: CustomerItem) => {
        // 获取用户详情以获取最新的优惠券数量
        try {
            const userDetail = await request<CustomerItem>(`/api/users/${user.id}`);
            setCurrentUser({ ...user, ...userDetail });
        } catch {
            setCurrentUser(user);
        }
        setDetailTab('orders');
        setDrawerVisible(true);
    };

    const handleAddMember = async (values: any) => {
        try {
            await request('/api/users', { method: 'POST', data: values });
            message.success('添加成功');
            actionRef.current?.reload();
            return true;
        } catch (e: any) {
            message.error(e.message || '添加失败');
            return false;
        }
    };

    const handleRecharge = async (values: { amount: number; remark?: string }) => {
        if (!currentUser) return false;
        try {
            await request(`/api/users/${currentUser.id}/recharge`, { method: 'POST', data: values });
            message.success('充值成功');
            setRechargeModalVisible(false);
            // 刷新用户详情
            viewDetail(currentUser);
            actionRef.current?.reload();
            return true;
        } catch (e: any) {
            message.error(e.message || '充值失败');
            return false;
        }
    };

    const handleGiftPoints = async (values: { amount: number; remark?: string }) => {
        if (!currentUser) return false;
        try {
            await request(`/api/users/${currentUser.id}/gift-points`, { method: 'POST', data: values });
            message.success('赠送成功');
            setGiftPointsModalVisible(false);
            // 刷新用户详情
            viewDetail(currentUser);
            actionRef.current?.reload();
            return true;
        } catch (e: any) {
            message.error(e.message || '赠送失败');
            return false;
        }
    };

    const handleIssueCoupon = async (values: { couponId: string }) => {
        if (!currentUser) return false;
        try {
            await request(`/api/users/${currentUser.id}/issue-coupon`, { method: 'POST', data: values });
            message.success('发放成功');
            setIssueCouponModalVisible(false);
            // 刷新用户详情
            viewDetail(currentUser);
            actionRef.current?.reload();
            return true;
        } catch (e: any) {
            message.error(e.message || '发放失败');
            return false;
        }
    };

    // 详情页 Tabs
    const detailTabItems = [
        {
            key: 'orders',
            label: '订单记录',
            children: currentUser && (
                <ProTable<OrderItem>
                    headerTitle={false}
                    rowKey="id"
                    columns={orderColumns}
                    search={false}
                    options={false}
                    pagination={{ pageSize: 5 }}
                    request={async (params) => {
                        const res = await request<{ data: OrderItem[]; total: number }>(`/api/users/${currentUser.id}/orders`, {
                            params: { current: params.current, pageSize: params.pageSize },
                        });
                        return { data: res.data || [], total: res.total || 0, success: true };
                    }}
                />
            ),
        },
        {
            key: 'balance',
            label: '余额记录',
            children: currentUser && (
                <ProTable<RecordItem>
                    headerTitle={false}
                    rowKey="id"
                    columns={balanceRecordColumns}
                    search={false}
                    options={false}
                    pagination={{ pageSize: 5 }}
                    request={async (params) => {
                        const res = await request<{ data: RecordItem[]; total: number }>(`/api/users/${currentUser.id}/balance-records`, {
                            params: { current: params.current, pageSize: params.pageSize },
                        });
                        return { data: res.data || [], total: res.total || 0, success: true };
                    }}
                />
            ),
        },
        {
            key: 'points',
            label: '积分记录',
            children: currentUser && (
                <ProTable<RecordItem>
                    headerTitle={false}
                    rowKey="id"
                    columns={pointsRecordColumns}
                    search={false}
                    options={false}
                    pagination={{ pageSize: 5 }}
                    request={async (params) => {
                        const res = await request<{ data: RecordItem[]; total: number }>(`/api/users/${currentUser.id}/points-records`, {
                            params: { current: params.current, pageSize: params.pageSize },
                        });
                        return { data: res.data || [], total: res.total || 0, success: true };
                    }}
                />
            ),
        },
        {
            key: 'coupons',
            label: '优惠券记录',
            children: currentUser && (
                <ProTable<UserCouponItem>
                    headerTitle={false}
                    rowKey="id"
                    columns={couponRecordColumns}
                    search={false}
                    options={false}
                    pagination={{ pageSize: 5 }}
                    request={async (params) => {
                        const res = await request<{ data: UserCouponItem[]; total: number }>(`/api/users/${currentUser.id}/coupons`, {
                            params: { current: params.current, pageSize: params.pageSize },
                        });
                        return { data: res.data || [], total: res.total || 0, success: true };
                    }}
                />
            ),
        },
    ];

    const tabItems = [
        {
            key: 'members',
            label: '会员列表',
            children: (
                <ProTable<CustomerItem>
                    headerTitle="会员列表"
                    actionRef={actionRef}
                    rowKey="id"
                    columns={memberColumns}
                    request={async (params) => {
                        const res = await request<{ data: CustomerItem[]; total: number }>('/api/users', {
                            params: {
                                current: params.current,
                                pageSize: params.pageSize,
                                search: params.mobile || params.name,
                            },
                        });
                        return { data: res.data || [], total: res.total || 0, success: true };
                    }}
                    toolBarRender={() => [
                        <ModalForm
                            key="add"
                            title="添加会员"
                            trigger={<Button type="primary" icon={<PlusOutlined />}>添加会员</Button>}
                            onFinish={handleAddMember}
                        >
                            <ProFormText name="mobile" label="手机号" rules={[{ required: true, message: '请输入手机号' }]} />
                            <ProFormText name="name" label="姓名" />
                            <ProFormText.Password name="password" label="密码" rules={[{ required: true }]} />
                            <ProFormDatePicker name="birthday" label="生日" />
                        </ModalForm>,
                        <Button key="import" icon={<ImportOutlined />} onClick={() => message.info('导入功能开发中')}>导入会员</Button>,
                        <Button key="export" icon={<ExportOutlined />} onClick={() => message.info('导出功能开发中')}>导出会员</Button>,
                    ]}
                    pagination={{ pageSize: 20 }}
                    search={{ labelWidth: 'auto' }}
                />
            ),
        },
        {
            key: 'deposits',
            label: '会员押金',
            children: (
                <ProTable<DepositItem>
                    headerTitle="会员押金"
                    rowKey="id"
                    columns={depositColumns}
                    request={async (params) => {
                        const res = await request<{ data: DepositItem[]; total: number }>('/api/deposits', {
                            params: { current: params.current, pageSize: params.pageSize },
                        });
                        return { data: res.data || [], total: res.total || 0, success: true };
                    }}
                    search={false}
                />
            ),
        },
    ];

    return (
        <PageContainer>
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

            <Drawer
                width={720}
                open={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                title="会员详情"
            >
                {currentUser && (
                    <>
                        <Card size="small" style={{ marginBottom: 16 }}>
                            <Row gutter={16}>
                                <Col span={6}><Statistic title="余额" value={Number(currentUser.balance).toFixed(2)} prefix="¥" /></Col>
                                <Col span={6}><Statistic title="积分" value={currentUser.points} /></Col>
                                <Col span={6}><Statistic title="订单数" value={currentUser.orderCount || 0} /></Col>
                                <Col span={6}><Statistic title="优惠券" value={currentUser.couponCount || 0} /></Col>
                            </Row>
                        </Card>
                        <ProDescriptions column={2} title="基本信息">
                            <ProDescriptions.Item label="手机号">{currentUser.mobile}</ProDescriptions.Item>
                            <ProDescriptions.Item label="姓名">{currentUser.name || '-'}</ProDescriptions.Item>
                            <ProDescriptions.Item label="欠桶">{currentUser.depositCount || 0}</ProDescriptions.Item>
                            <ProDescriptions.Item label="水票">{currentUser.ticketCount || 0}</ProDescriptions.Item>
                            <ProDescriptions.Item label="注册时间">{formatChinaTime(currentUser.createdAt)}</ProDescriptions.Item>
                        </ProDescriptions>
                        <div style={{ marginTop: 24, marginBottom: 24 }}>
                            <Space>
                                <Button type="primary" icon={<WalletOutlined />} onClick={() => setRechargeModalVisible(true)}>充值余额</Button>
                                <Button icon={<GiftOutlined />} onClick={() => setGiftPointsModalVisible(true)}>赠送积分</Button>
                                <Button icon={<CreditCardOutlined />} onClick={() => setIssueCouponModalVisible(true)}>发放优惠券</Button>
                            </Space>
                        </div>
                        <Tabs activeKey={detailTab} onChange={setDetailTab} items={detailTabItems} />
                    </>
                )}
            </Drawer>

            {/* 充值余额弹窗 */}
            <ModalForm
                title="充值余额"
                open={rechargeModalVisible}
                onOpenChange={setRechargeModalVisible}
                onFinish={handleRecharge}
                width={400}
            >
                <ProFormDigit
                    name="amount"
                    label="充值金额"
                    min={0.01}
                    fieldProps={{ precision: 2, prefix: '¥' }}
                    rules={[{ required: true, message: '请输入充值金额' }]}
                />
                <ProFormTextArea name="remark" label="备注" placeholder="可选，如：活动赠送" />
            </ModalForm>

            {/* 赠送积分弹窗 */}
            <ModalForm
                title="赠送积分"
                open={giftPointsModalVisible}
                onOpenChange={setGiftPointsModalVisible}
                onFinish={handleGiftPoints}
                width={400}
            >
                <ProFormDigit
                    name="amount"
                    label="赠送积分"
                    min={1}
                    fieldProps={{ precision: 0 }}
                    rules={[{ required: true, message: '请输入赠送积分' }]}
                />
                <ProFormTextArea name="remark" label="备注" placeholder="可选，如：生日赠送" />
            </ModalForm>

            {/* 发放优惠券弹窗 */}
            <ModalForm
                title="发放优惠券"
                open={issueCouponModalVisible}
                onOpenChange={setIssueCouponModalVisible}
                onFinish={handleIssueCoupon}
                width={400}
            >
                <ProFormSelect
                    name="couponId"
                    label="选择优惠券"
                    rules={[{ required: true, message: '请选择优惠券' }]}
                    request={async () => {
                        const res = await request<{ data: { id: string; name: string; value: number; type: string }[] }>('/api/coupons', { params: { pageSize: 100 } });
                        return (res.data || []).map(c => ({
                            label: `${c.name} (${c.type === 'DISCOUNT' ? c.value + '折' : '¥' + c.value})`,
                            value: c.id,
                        }));
                    }}
                />
            </ModalForm>
        </PageContainer>
    );
};

export default CustomerList;
