import React, { useRef, useState } from 'react';
import { PageContainer, ProTable, ModalForm, ProFormText, ProFormDigit } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Popconfirm, message, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';

interface WaterTicketItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    originalPrice?: number;
    validDays: number;
    soldCount: number;
    isActive: boolean;
    createdAt: string;
}

const WaterTicketList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [editingTicket, setEditingTicket] = useState<WaterTicketItem | null>(null);

    const handleEdit = (record: WaterTicketItem) => {
        setEditingTicket(record);
    };

    const columns: ProColumns<WaterTicketItem>[] = [
        {
            title: '水票名称',
            dataIndex: 'name',
        },
        {
            title: '可兑换数量',
            dataIndex: 'quantity',
            search: false,
            render: (_, record) => `${record.quantity} 桶`,
        },
        {
            title: '售价',
            dataIndex: 'price',
            search: false,
            render: (_, record) => `¥${Number(record.price).toFixed(2)}`,
        },
        {
            title: '原价',
            dataIndex: 'originalPrice',
            search: false,
            render: (_, record) => record.originalPrice ? `¥${Number(record.originalPrice).toFixed(2)}` : '-',
        },
        {
            title: '有效期',
            dataIndex: 'validDays',
            search: false,
            render: (_, record) => `${record.validDays || 365} 天`,
        },
        {
            title: '已售',
            dataIndex: 'soldCount',
            search: false,
        },
        {
            title: '状态',
            dataIndex: 'isActive',
            search: false,
            render: (_, record) => (
                <Switch
                    checked={record.isActive}
                    onChange={async (checked) => {
                        await request(`/api/water-tickets/${record.id}`, {
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
            title: '创建时间',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            search: false,
        },
        {
            title: '操作',
            valueType: 'option',
            render: (_, record) => [
                <a key="edit" onClick={() => handleEdit(record)}>编辑</a>,
                <Popconfirm
                    key="delete"
                    title="确定删除该水票吗？"
                    onConfirm={async () => {
                        await request(`/api/water-tickets/${record.id}`, { method: 'DELETE' });
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
            <ProTable<WaterTicketItem>
                headerTitle="水票列表"
                actionRef={actionRef}
                rowKey="id"
                columns={columns}
                request={async (params) => {
                    const res = await request<{ data: WaterTicketItem[]; total: number }>('/api/water-tickets', {
                        params: {
                            current: params.current,
                            pageSize: params.pageSize,
                        },
                    });
                    return {
                        data: res.data || [],
                        total: res.total || 0,
                        success: true,
                    };
                }}
                toolBarRender={() => [
                    <ModalForm
                        key="create"
                        title="创建水票"
                        trigger={
                            <Button type="primary" icon={<PlusOutlined />}>
                                新建水票
                            </Button>
                        }
                        onFinish={async (values) => {
                            await request('/api/water-tickets', {
                                method: 'POST',
                                data: values,
                            });
                            message.success('创建成功');
                            actionRef.current?.reload();
                            return true;
                        }}
                    >
                        <ProFormText
                            name="name"
                            label="水票名称"
                            rules={[{ required: true, message: '请输入名称' }]}
                            placeholder="例如：18.9L桶装水票（10桶）"
                        />
                        <ProFormDigit
                            name="quantity"
                            label="可兑换数量"
                            rules={[{ required: true, message: '请输入数量' }]}
                            min={1}
                            fieldProps={{ precision: 0 }}
                            extra="每张水票可兑换的桶数"
                        />
                        <ProFormDigit
                            name="price"
                            label="售价"
                            rules={[{ required: true, message: '请输入售价' }]}
                            fieldProps={{ precision: 2 }}
                        />
                        <ProFormDigit
                            name="originalPrice"
                            label="原价"
                            fieldProps={{ precision: 2 }}
                            extra="选填，用于展示优惠"
                        />
                        <ProFormDigit
                            name="validDays"
                            label="有效期（天）"
                            initialValue={365}
                            fieldProps={{ precision: 0 }}
                        />
                    </ModalForm>,
                ]}
                pagination={{ pageSize: 20 }}
                search={false}
            />

            {/* 编辑水票弹窗 */}
            <ModalForm
                title="编辑水票"
                open={!!editingTicket}
                onOpenChange={(open) => !open && setEditingTicket(null)}
                initialValues={editingTicket ? {
                    ...editingTicket,
                    price: Number(editingTicket.price),
                    originalPrice: editingTicket.originalPrice ? Number(editingTicket.originalPrice) : undefined,
                } : {}}
                onFinish={async (values) => {
                    await request(`/api/water-tickets/${editingTicket?.id}`, {
                        method: 'PUT',
                        data: values,
                    });
                    message.success('更新成功');
                    setEditingTicket(null);
                    actionRef.current?.reload();
                    return true;
                }}
            >
                <ProFormText
                    name="name"
                    label="水票名称"
                    rules={[{ required: true, message: '请输入名称' }]}
                />
                <ProFormDigit
                    name="quantity"
                    label="可兑换数量"
                    rules={[{ required: true, message: '请输入数量' }]}
                    min={1}
                    fieldProps={{ precision: 0 }}
                />
                <ProFormDigit
                    name="price"
                    label="售价"
                    rules={[{ required: true, message: '请输入售价' }]}
                    fieldProps={{ precision: 2 }}
                />
                <ProFormDigit
                    name="originalPrice"
                    label="原价"
                    fieldProps={{ precision: 2 }}
                />
                <ProFormDigit
                    name="validDays"
                    label="有效期（天）"
                    fieldProps={{ precision: 0 }}
                />
            </ModalForm>
        </PageContainer>
    );
};

export default WaterTicketList;
