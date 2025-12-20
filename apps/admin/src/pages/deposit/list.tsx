import React, { useRef, useState, useEffect } from 'react';
import { PageContainer, ProTable, ModalForm, ProFormText, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Popconfirm, Tag, message, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';

interface DepositTypeItem {
    id: string;
    name: string;
    amount: number;
    description?: string;
    depositCount: number;
    isActive: boolean;
}

interface UserDepositItem {
    id: string;
    userId: string;
    quantity: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    user: { mobile: string; name?: string };
    depositType: { name: string };
}

const statusLabels: Record<string, { text: string; color: string }> = {
    HOLDING: { text: '持有中', color: 'blue' },
    RETURNED: { text: '已退还', color: 'green' },
    FORFEITED: { text: '已没收', color: 'red' },
};

const DepositList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const typeActionRef = useRef<ActionType>();
    const [depositTypes, setDepositTypes] = useState<DepositTypeItem[]>([]);

    useEffect(() => {
        loadDepositTypes();
    }, []);

    const loadDepositTypes = async () => {
        try {
            const res = await request<{ data: DepositTypeItem[] }>('/api/deposits/types');
            setDepositTypes(res.data || []);
        } catch (e) {
            console.error(e);
        }
    };

    const typeColumns: ProColumns<DepositTypeItem>[] = [
        { title: '押金名称', dataIndex: 'name' },
        { title: '金额', dataIndex: 'amount', render: (_, r) => `¥${Number(r.amount).toFixed(2)}` },
        { title: '说明', dataIndex: 'description', render: (_, r) => r.description || '-' },
        { title: '收取数', dataIndex: 'depositCount' },
        {
            title: '操作',
            valueType: 'option',
            render: (_, record) => [
                <Popconfirm
                    key="delete"
                    title="确定删除吗？"
                    onConfirm={async () => {
                        await request(`/api/deposits/types/${record.id}`, { method: 'DELETE' });
                        message.success('删除成功');
                        typeActionRef.current?.reload();
                        loadDepositTypes();
                    }}
                >
                    <a>删除</a>
                </Popconfirm>,
            ],
        },
    ];

    const depositColumns: ProColumns<UserDepositItem>[] = [
        { title: '用户', dataIndex: ['user', 'mobile'] },
        { title: '用户姓名', dataIndex: ['user', 'name'], render: (_, r) => r.user?.name || '-' },
        { title: '押金类型', dataIndex: ['depositType', 'name'] },
        { title: '数量', dataIndex: 'quantity' },
        { title: '总金额', dataIndex: 'totalAmount', render: (_, r) => `¥${Number(r.totalAmount).toFixed(2)}` },
        {
            title: '状态',
            dataIndex: 'status',
            render: (_, r) => {
                const s = statusLabels[r.status] || { text: r.status, color: 'default' };
                return <Tag color={s.color}>{s.text}</Tag>;
            },
        },
        { title: '收取时间', dataIndex: 'createdAt', valueType: 'dateTime' },
        {
            title: '操作',
            valueType: 'option',
            render: (_, record) => {
                if (record.status !== 'HOLDING') return '-';
                return [
                    <Popconfirm
                        key="return"
                        title="确定退还押金吗？"
                        onConfirm={async () => {
                            await request(`/api/deposits/${record.id}/return`, { method: 'POST' });
                            message.success('已退还');
                            actionRef.current?.reload();
                        }}
                    >
                        <a>退还</a>
                    </Popconfirm>,
                ];
            },
        },
    ];

    return (
        <PageContainer>
            <Tabs
                items={[
                    {
                        key: 'types',
                        label: '押金类型',
                        children: (
                            <ProTable<DepositTypeItem>
                                actionRef={typeActionRef}
                                rowKey="id"
                                columns={typeColumns}
                                request={async (params) => {
                                    const res = await request<{ data: DepositTypeItem[]; total: number }>('/api/deposits/types', {
                                        params: { current: params.current, pageSize: params.pageSize },
                                    });
                                    return { data: res.data, total: res.total, success: true };
                                }}
                                toolBarRender={() => [
                                    <ModalForm
                                        key="create"
                                        title="创建押金类型"
                                        trigger={<Button type="primary" icon={<PlusOutlined />}>新建类型</Button>}
                                        onFinish={async (values) => {
                                            await request('/api/deposits/types', { method: 'POST', data: values });
                                            message.success('创建成功');
                                            typeActionRef.current?.reload();
                                            loadDepositTypes();
                                            return true;
                                        }}
                                    >
                                        <ProFormText name="name" label="押金名称" rules={[{ required: true }]} placeholder="例如：桶押金" />
                                        <ProFormDigit name="amount" label="金额" rules={[{ required: true }]} fieldProps={{ precision: 2 }} />
                                        <ProFormText name="description" label="说明" placeholder="选填" />
                                    </ModalForm>,
                                ]}
                                search={false}
                                pagination={{ pageSize: 10 }}
                            />
                        ),
                    },
                    {
                        key: 'records',
                        label: '押金记录',
                        children: (
                            <ProTable<UserDepositItem>
                                actionRef={actionRef}
                                rowKey="id"
                                columns={depositColumns}
                                request={async (params) => {
                                    const res = await request<{ data: UserDepositItem[]; total: number }>('/api/deposits', {
                                        params: { current: params.current, pageSize: params.pageSize, status: params.status },
                                    });
                                    return { data: res.data, total: res.total, success: true };
                                }}
                                toolBarRender={() => [
                                    <ModalForm
                                        key="collect"
                                        title="收取押金"
                                        trigger={<Button type="primary" icon={<PlusOutlined />}>收取押金</Button>}
                                        onFinish={async (values) => {
                                            await request('/api/deposits/collect', { method: 'POST', data: values });
                                            message.success('收取成功');
                                            actionRef.current?.reload();
                                            return true;
                                        }}
                                    >
                                        <ProFormText name="userId" label="用户ID" rules={[{ required: true }]} />
                                        <ProFormSelect
                                            name="depositTypeId"
                                            label="押金类型"
                                            rules={[{ required: true }]}
                                            options={depositTypes.map(t => ({ label: `${t.name} (¥${t.amount})`, value: t.id }))}
                                        />
                                        <ProFormDigit name="quantity" label="数量" initialValue={1} min={1} />
                                    </ModalForm>,
                                ]}
                                search={false}
                                pagination={{ pageSize: 20 }}
                            />
                        ),
                    },
                ]}
            />
        </PageContainer>
    );
};

export default DepositList;
