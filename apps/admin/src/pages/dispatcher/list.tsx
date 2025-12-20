import React, { useRef, useState } from 'react';
import { PageContainer, ProTable, ModalForm, ProFormText } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Popconfirm, message, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';

interface DispatcherItem {
    id: string;
    name: string;
    phone: string;
    status: string;
    areaIds: string[];
    dispatchCount: number;
    createdAt: string;
}

const DispatcherList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [editingDispatcher, setEditingDispatcher] = useState<DispatcherItem | null>(null);

    const handleEdit = (record: DispatcherItem) => {
        setEditingDispatcher(record);
    };

    const columns: ProColumns<DispatcherItem>[] = [
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            copyable: true,
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (_, record) => (
                <Switch
                    checked={record.status === 'ACTIVE'}
                    checkedChildren="在线"
                    unCheckedChildren="离线"
                    onChange={async (checked) => {
                        await request(`/api/dispatchers/${record.id}`, {
                            method: 'PUT',
                            data: { status: checked ? 'ACTIVE' : 'INACTIVE' },
                        });
                        message.success(checked ? '已上线' : '已下线');
                        actionRef.current?.reload();
                    }}
                />
            ),
        },
        {
            title: '配送次数',
            dataIndex: 'dispatchCount',
            search: false,
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
                    title="确定删除该配送员吗？"
                    onConfirm={async () => {
                        await request(`/api/dispatchers/${record.id}`, { method: 'DELETE' });
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
            <ProTable<DispatcherItem>
                headerTitle="配送员列表"
                actionRef={actionRef}
                rowKey="id"
                columns={columns}
                request={async (params) => {
                    const res = await request<{ data: DispatcherItem[]; total: number }>('/api/dispatchers', {
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
                        title="添加配送员"
                        trigger={
                            <Button type="primary" icon={<PlusOutlined />}>
                                添加配送员
                            </Button>
                        }
                        onFinish={async (values) => {
                            await request('/api/dispatchers', {
                                method: 'POST',
                                data: values,
                            });
                            message.success('添加成功');
                            actionRef.current?.reload();
                            return true;
                        }}
                    >
                        <ProFormText
                            name="name"
                            label="姓名"
                            rules={[{ required: true, message: '请输入姓名' }]}
                        />
                        <ProFormText
                            name="phone"
                            label="手机号"
                            rules={[
                                { required: true, message: '请输入手机号' },
                                { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
                            ]}
                        />
                    </ModalForm>,
                ]}
                pagination={{ pageSize: 20 }}
                search={false}
            />

            {/* 编辑配送员弹窗 */}
            <ModalForm
                title="编辑配送员"
                open={!!editingDispatcher}
                onOpenChange={(open) => !open && setEditingDispatcher(null)}
                initialValues={editingDispatcher || {}}
                onFinish={async (values) => {
                    await request(`/api/dispatchers/${editingDispatcher?.id}`, {
                        method: 'PUT',
                        data: values,
                    });
                    message.success('更新成功');
                    setEditingDispatcher(null);
                    actionRef.current?.reload();
                    return true;
                }}
            >
                <ProFormText
                    name="name"
                    label="姓名"
                    rules={[{ required: true, message: '请输入姓名' }]}
                />
                <ProFormText
                    name="phone"
                    label="手机号"
                    rules={[
                        { required: true, message: '请输入手机号' },
                        { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
                    ]}
                />
            </ModalForm>
        </PageContainer>
    );
};

export default DispatcherList;
