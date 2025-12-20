import React, { useRef, useState, useEffect } from 'react';
import {
    PageContainer,
    ProTable,
    ModalForm,
    ProFormText,
    ProFormDigit,
    ProFormSelect,
    ProFormDateTimeRangePicker,
    ProFormSwitch,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Popconfirm, Tag, message, Switch, Alert, Select, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';

interface CouponItem {
    id: string;
    name: string;
    category: string;
    type: string;
    value: number;
    minSpend: number;
    issueStartAt?: string;
    issueEndAt?: string;
    useStartAt?: string;
    useEndAt?: string;
    quota: number;
    issuedCount: number;
    pointsExchange: boolean;
    pointsCost: number;
    isActive: boolean;
    usedCount: number;
    applicableScope?: any;
    createdAt: string;
}

interface ProductItem {
    id: string;
    name: string;
}

const categoryOptions = [
    { label: '普通券', value: 'NORMAL' },
    { label: '新人券', value: 'NEW_USER' },
    { label: '会员券', value: 'MEMBER' },
    { label: '邀请券', value: 'INVITE' },
];

const categoryColors: Record<string, string> = {
    NORMAL: 'blue',
    NEW_USER: 'green',
    MEMBER: 'purple',
    INVITE: 'orange',
};

const categoryLabels: Record<string, string> = {
    NORMAL: '普通券',
    NEW_USER: '新人券',
    MEMBER: '会员券',
    INVITE: '邀请券',
};

const categoryHints: Record<string, string> = {
    NORMAL: '',
    NEW_USER: '新人券将在用户注册后自动发放至账号',
    MEMBER: '',
    INVITE: '邀请券用于邀请新人后，邀请人与被邀请人同时获取',
};

const CouponList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [selectedCategory, setSelectedCategory] = useState<string>('NORMAL');
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [scopeType, setScopeType] = useState<string>('ALL');
    const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);
    const [editScopeType, setEditScopeType] = useState<string>('ALL');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await request<{ items?: ProductItem[]; data?: ProductItem[] }>('/api/products');
            // API 返回 { items: [...] } 或 { data: [...] }
            setProducts(res.items || res.data || []);
        } catch (e) {
            console.error('Failed to load products:', e);
        }
    };

    const handleEdit = (record: CouponItem) => {
        // 判断适用范围
        const scope = record.applicableScope;
        const isSpecific = scope && scope !== 'ALL' && scope.productIds?.length > 0;
        setEditScopeType(isSpecific ? 'SPECIFIC' : 'ALL');
        setEditingCoupon(record);
    };

    const columns: ProColumns<CouponItem>[] = [
        {
            title: '券名称',
            dataIndex: 'name',
        },
        {
            title: '分类',
            dataIndex: 'category',
            render: (_, record) => (
                <Tag color={categoryColors[record.category]}>
                    {categoryLabels[record.category] || record.category}
                </Tag>
            ),
            valueType: 'select',
            valueEnum: {
                NORMAL: { text: '普通券' },
                NEW_USER: { text: '新人券' },
                MEMBER: { text: '会员券' },
                INVITE: { text: '邀请券' },
            },
        },
        {
            title: '优惠金额',
            dataIndex: 'value',
            search: false,
            render: (_, record) => `¥${Number(record.value).toFixed(2)}`,
        },
        {
            title: '满减条件',
            dataIndex: 'minSpend',
            search: false,
            render: (_, record) =>
                Number(record.minSpend) > 0 ? `满¥${Number(record.minSpend).toFixed(2)}` : '无门槛',
        },
        {
            title: '适用商品',
            dataIndex: 'applicableScope',
            search: false,
            render: (_, record) => {
                if (!record.applicableScope || record.applicableScope === 'ALL') {
                    return <Tag>全部商品</Tag>;
                }
                const productIds = record.applicableScope.productIds || [];
                return <Tag color="blue">{productIds.length}个指定商品</Tag>;
            },
        },
        {
            title: '发放/配额',
            dataIndex: 'issuedCount',
            search: false,
            render: (_, record) =>
                record.quota > 0 ? `${record.issuedCount}/${record.quota}` : `${record.issuedCount}/不限`,
        },
        {
            title: '状态',
            dataIndex: 'isActive',
            search: false,
            render: (_, record) => (
                <Switch
                    checked={record.isActive}
                    checkedChildren="上架"
                    unCheckedChildren="下架"
                    onChange={async (checked) => {
                        await request(`/api/coupons/${record.id}`, {
                            method: 'PUT',
                            data: { isActive: checked },
                        });
                        message.success(checked ? '已上架' : '已下架');
                        actionRef.current?.reload();
                    }}
                />
            ),
        },
        {
            title: '操作',
            valueType: 'option',
            render: (_, record) => [
                <a key="edit" onClick={() => handleEdit(record)}>编辑</a>,
                <Popconfirm
                    key="delete"
                    title="确定删除该优惠券吗？"
                    onConfirm={async () => {
                        await request(`/api/coupons/${record.id}`, { method: 'DELETE' });
                        message.success('删除成功');
                        actionRef.current?.reload();
                    }}
                >
                    <a>删除</a>
                </Popconfirm>,
            ],
        },
    ];

    return (
        <PageContainer>
            <ProTable<CouponItem>
                headerTitle="优惠券列表"
                actionRef={actionRef}
                rowKey="id"
                columns={columns}
                request={async (params) => {
                    const res = await request<{ data: CouponItem[]; total: number }>('/api/coupons', {
                        params: {
                            current: params.current,
                            pageSize: params.pageSize,
                            category: params.category,
                        },
                    });
                    return {
                        data: res.data,
                        total: res.total,
                        success: true,
                    };
                }}
                toolBarRender={() => [
                    <ModalForm
                        key="create"
                        title="添加优惠券"
                        trigger={
                            <Button type="primary" icon={<PlusOutlined />}>
                                添加优惠券
                            </Button>
                        }
                        width={650}
                        onValuesChange={(changedValues) => {
                            if (changedValues.category) {
                                setSelectedCategory(changedValues.category);
                            }
                            if (changedValues.scopeType !== undefined) {
                                setScopeType(changedValues.scopeType);
                            }
                        }}
                        onFinish={async (values) => {
                            const data: any = {
                                name: values.name,
                                category: values.category,
                                value: values.value,
                                minSpend: values.minSpend || 0,
                                quota: values.quota || 0,
                                pointsExchange: values.pointsExchange || false,
                                pointsCost: values.pointsCost || 0,
                            };

                            // 处理适用商品范围
                            if (values.scopeType === 'SPECIFIC' && values.productIds?.length > 0) {
                                data.applicableScope = { productIds: values.productIds };
                            } else {
                                data.applicableScope = 'ALL';
                            }

                            if (values.issuePeriod) {
                                data.issueStartAt = values.issuePeriod[0];
                                data.issueEndAt = values.issuePeriod[1];
                            }
                            if (values.usePeriod) {
                                data.useStartAt = values.usePeriod[0];
                                data.useEndAt = values.usePeriod[1];
                            }

                            await request('/api/coupons', {
                                method: 'POST',
                                data,
                            });
                            message.success('创建成功');
                            actionRef.current?.reload();
                            setScopeType('ALL');
                            return true;
                        }}
                    >
                        <ProFormText
                            name="name"
                            label="券名称"
                            rules={[{ required: true, message: '请输入名称' }]}
                            fieldProps={{ maxLength: 20, showCount: true }}
                            placeholder="请输入项目名称"
                        />
                        <ProFormSelect
                            name="category"
                            label="分类"
                            options={categoryOptions}
                            initialValue="NORMAL"
                            rules={[{ required: true }]}
                        />
                        {categoryHints[selectedCategory] && (
                            <Alert
                                message={categoryHints[selectedCategory]}
                                type="info"
                                showIcon
                                style={{ marginBottom: 24 }}
                            />
                        )}
                        <ProFormDateTimeRangePicker
                            name="issuePeriod"
                            label="发放时间"
                            placeholder={['开始日期', '结束日期']}
                        />
                        <ProFormDigit
                            name="value"
                            label="优惠金额"
                            rules={[{ required: true, message: '请输入金额' }]}
                            fieldProps={{ precision: 2, prefix: '¥' }}
                        />
                        <ProFormDigit
                            name="minSpend"
                            label="满减条件"
                            fieldProps={{ precision: 2, prefix: '¥' }}
                            extra="0表示无门槛"
                        />
                        <ProFormDateTimeRangePicker
                            name="usePeriod"
                            label="使用有效期"
                            placeholder={['开始日期', '结束日期']}
                        />

                        {/* 适用商品范围 */}
                        <ProFormSelect
                            name="scopeType"
                            label="适用商品"
                            options={[
                                { label: '全部商品', value: 'ALL' },
                                { label: '指定商品', value: 'SPECIFIC' },
                            ]}
                            initialValue="ALL"
                        />
                        {scopeType === 'SPECIFIC' && (
                            <Form.Item
                                name="productIds"
                                label="选择商品"
                                rules={[{ required: true, message: '请选择至少一个商品' }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="请选择适用的商品"
                                    style={{ width: '100%' }}
                                    options={products.map(p => ({
                                        label: p.name,
                                        value: p.id,
                                    }))}
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        )}

                        <ProFormDigit
                            name="quota"
                            label="配额：发券数量"
                            fieldProps={{ precision: 0 }}
                            extra="0表示不限量"
                        />
                        <ProFormSwitch
                            name="pointsExchange"
                            label="是否可用积分兑换"
                        />
                        <ProFormDigit
                            name="pointsCost"
                            label="兑换所需积分"
                            fieldProps={{ precision: 0 }}
                        />
                    </ModalForm>,
                ]}
                pagination={{ pageSize: 20 }}
            />

            {/* 编辑优惠券弹窗 */}
            <ModalForm
                title="编辑优惠券"
                open={!!editingCoupon}
                onOpenChange={(open) => !open && setEditingCoupon(null)}
                initialValues={editingCoupon ? {
                    name: editingCoupon.name,
                    category: editingCoupon.category,
                    value: Number(editingCoupon.value),
                    minSpend: Number(editingCoupon.minSpend),
                    quota: editingCoupon.quota,
                    pointsExchange: editingCoupon.pointsExchange,
                    pointsCost: editingCoupon.pointsCost,
                    scopeType: editingCoupon.applicableScope && editingCoupon.applicableScope !== 'ALL' ? 'SPECIFIC' : 'ALL',
                    productIds: editingCoupon.applicableScope?.productIds || [],
                    usePeriod: editingCoupon.useStartAt && editingCoupon.useEndAt
                        ? [editingCoupon.useStartAt, editingCoupon.useEndAt]
                        : undefined,
                    issuePeriod: editingCoupon.issueStartAt && editingCoupon.issueEndAt
                        ? [editingCoupon.issueStartAt, editingCoupon.issueEndAt]
                        : undefined,
                } : {}}
                width={650}
                onValuesChange={(changedValues) => {
                    if (changedValues.scopeType !== undefined) {
                        setEditScopeType(changedValues.scopeType);
                    }
                }}
                onFinish={async (values) => {
                    const data: any = {
                        name: values.name,
                        category: values.category,
                        value: values.value,
                        minSpend: values.minSpend || 0,
                        quota: values.quota || 0,
                        pointsExchange: values.pointsExchange || false,
                        pointsCost: values.pointsCost || 0,
                    };

                    // 处理适用商品范围
                    if (values.scopeType === 'SPECIFIC' && values.productIds?.length > 0) {
                        data.applicableScope = { productIds: values.productIds };
                    } else {
                        data.applicableScope = 'ALL';
                    }

                    if (values.issuePeriod) {
                        data.issueStartAt = values.issuePeriod[0];
                        data.issueEndAt = values.issuePeriod[1];
                    }
                    if (values.usePeriod) {
                        data.useStartAt = values.usePeriod[0];
                        data.useEndAt = values.usePeriod[1];
                    }

                    await request(`/api/coupons/${editingCoupon?.id}`, {
                        method: 'PUT',
                        data,
                    });
                    message.success('更新成功');
                    setEditingCoupon(null);
                    actionRef.current?.reload();
                    return true;
                }}
            >
                <ProFormText
                    name="name"
                    label="券名称"
                    rules={[{ required: true, message: '请输入名称' }]}
                    fieldProps={{ maxLength: 20, showCount: true }}
                />
                <ProFormSelect
                    name="category"
                    label="分类"
                    options={categoryOptions}
                    rules={[{ required: true }]}
                />
                <ProFormDateTimeRangePicker
                    name="issuePeriod"
                    label="发放时间"
                    placeholder={['开始日期', '结束日期']}
                />
                <ProFormDigit
                    name="value"
                    label="优惠金额"
                    rules={[{ required: true, message: '请输入金额' }]}
                    fieldProps={{ precision: 2, prefix: '¥' }}
                />
                <ProFormDigit
                    name="minSpend"
                    label="满减条件"
                    fieldProps={{ precision: 2, prefix: '¥' }}
                    extra="0表示无门槛"
                />
                <ProFormDateTimeRangePicker
                    name="usePeriod"
                    label="使用有效期"
                    placeholder={['开始日期', '结束日期']}
                />
                <ProFormSelect
                    name="scopeType"
                    label="适用商品"
                    options={[
                        { label: '全部商品', value: 'ALL' },
                        { label: '指定商品', value: 'SPECIFIC' },
                    ]}
                />
                {editScopeType === 'SPECIFIC' && (
                    <Form.Item
                        name="productIds"
                        label="选择商品"
                        rules={[{ required: true, message: '请选择至少一个商品' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="请选择适用的商品"
                            style={{ width: '100%' }}
                            options={products.map(p => ({
                                label: p.name,
                                value: p.id,
                            }))}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>
                )}
                <ProFormDigit
                    name="quota"
                    label="配额：发券数量"
                    fieldProps={{ precision: 0 }}
                    extra="0表示不限量"
                />
                <ProFormSwitch
                    name="pointsExchange"
                    label="是否可用积分兑换"
                />
                <ProFormDigit
                    name="pointsCost"
                    label="兑换所需积分"
                    fieldProps={{ precision: 0 }}
                />
            </ModalForm>
        </PageContainer>
    );
};

export default CouponList;

