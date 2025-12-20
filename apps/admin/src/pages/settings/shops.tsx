import React, { useRef, useState } from 'react';
import {
    PageContainer,
    ProTable,
    ModalForm,
    ProFormText,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Popconfirm, message, Switch, Space, Typography } from 'antd';
import { PlusOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';

const { Text } = Typography;

interface ShopItem {
    id: string;
    name: string;
    phone?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    isActive: boolean;
    createdAt: string;
}

const ShopManagement: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [editingShop, setEditingShop] = useState<ShopItem | null>(null);

    const columns: ProColumns<ShopItem>[] = [
        {
            title: '门店ID',
            dataIndex: 'id',
            width: 100,
            ellipsis: true,
            copyable: true,
        },
        {
            title: '门店名称',
            dataIndex: 'name',
        },
        {
            title: '门店电话',
            dataIndex: 'phone',
            search: false,
        },
        {
            title: '门店地址',
            dataIndex: 'address',
            search: false,
            ellipsis: true,
        },
        {
            title: '地理坐标',
            dataIndex: 'latitude',
            search: false,
            render: (_, record) => {
                if (record.latitude && record.longitude) {
                    return (
                        <Space>
                            <EnvironmentOutlined />
                            <Text copyable>{`${record.latitude}/${record.longitude}`}</Text>
                        </Space>
                    );
                }
                return '-';
            },
        },
        {
            title: '状态',
            dataIndex: 'isActive',
            search: false,
            render: (_, record) => (
                <Switch
                    checked={record.isActive}
                    checkedChildren="启用"
                    unCheckedChildren="禁用"
                    onChange={async (checked) => {
                        await request(`/api/shops/${record.id}`, {
                            method: 'PUT',
                            data: { isActive: checked },
                        });
                        message.success(checked ? '已启用' : '已禁用');
                        actionRef.current?.reload();
                    }}
                />
            ),
        },
        {
            title: '操作',
            valueType: 'option',
            render: (_, record) => [
                <a key="edit" onClick={() => setEditingShop(record)}>编辑</a>,
                <Popconfirm
                    key="delete"
                    title="确定删除该门店吗？"
                    onConfirm={async () => {
                        await request(`/api/shops/${record.id}`, { method: 'DELETE' });
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
            <ProTable<ShopItem>
                headerTitle="门店管理"
                actionRef={actionRef}
                rowKey="id"
                columns={columns}
                request={async (params) => {
                    const res = await request<{ data: ShopItem[]; total: number }>('/api/shops', {
                        params: {
                            current: params.current,
                            pageSize: params.pageSize,
                            name: params.name,
                        },
                    });
                    return { data: res.data, total: res.total, success: true };
                }}
                toolBarRender={() => [
                    <ModalForm
                        key="create"
                        title="新增门店"
                        trigger={<Button type="primary" icon={<PlusOutlined />}>新增门店</Button>}
                        width={500}
                        onFinish={async (values) => {
                            const data: any = { name: values.name, phone: values.phone, address: values.address };
                            if (values.coordinates) {
                                const [lat, lng] = values.coordinates.split(',').map(Number);
                                data.latitude = lat;
                                data.longitude = lng;
                            }
                            await request('/api/shops', { method: 'POST', data });
                            message.success('创建成功');
                            actionRef.current?.reload();
                            return true;
                        }}
                    >
                        <ProFormText name="name" label="门店名称" rules={[{ required: true }]} placeholder="请输入门店名称" />
                        <ProFormText name="phone" label="门店电话" rules={[{ required: true }]} placeholder="请输入门店电话" />
                        <ProFormText name="address" label="门店地址" rules={[{ required: true }]} placeholder="请输入门店地址" />
                        <ProFormText name="coordinates" label="门店定位" placeholder="纬度,经度" extra="格式: 纬度,经度 (如: 28.317764,113.442598)" />
                    </ModalForm>,
                ]}
                pagination={{ pageSize: 20 }}
            />

            <ModalForm
                title="编辑门店"
                open={!!editingShop}
                onOpenChange={(open) => !open && setEditingShop(null)}
                initialValues={{
                    ...editingShop,
                    coordinates: editingShop?.latitude && editingShop?.longitude ? `${editingShop.latitude},${editingShop.longitude}` : '',
                }}
                width={500}
                onFinish={async (values) => {
                    const data: any = { name: values.name, phone: values.phone, address: values.address };
                    if (values.coordinates) {
                        const [lat, lng] = values.coordinates.split(',').map(Number);
                        data.latitude = lat;
                        data.longitude = lng;
                    }
                    await request(`/api/shops/${editingShop?.id}`, { method: 'PUT', data });
                    message.success('更新成功');
                    setEditingShop(null);
                    actionRef.current?.reload();
                    return true;
                }}
            >
                <ProFormText name="name" label="门店名称" rules={[{ required: true }]} />
                <ProFormText name="phone" label="门店电话" rules={[{ required: true }]} />
                <ProFormText name="address" label="门店地址" rules={[{ required: true }]} />
                <ProFormText name="coordinates" label="门店定位" placeholder="纬度,经度" extra="格式: 纬度,经度" />
            </ModalForm>
        </PageContainer>
    );
};

export default ShopManagement;
