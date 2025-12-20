import React, { useRef, useState } from 'react';
import {
    PageContainer,
    ProTable,
    ModalForm,
    ProFormText,
    ProFormSelect,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Popconfirm, message, Switch, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';

interface AdminItem {
    id: string;
    username: string;
    name?: string;
    mobile?: string;
    role: string;
    isActive: boolean;
    lastLoginAt?: string;
    createdAt: string;
}

const roleOptions = [
    { label: '超级管理员', value: 'super_admin' },
    { label: '管理员', value: 'admin' },
    { label: '操作员', value: 'operator' },
];

const roleColors: Record<string, string> = {
    super_admin: 'red',
    admin: 'blue',
    operator: 'green',
};

const roleLabels: Record<string, string> = {
    super_admin: '超级管理员',
    admin: '管理员',
    operator: '操作员',
};

const AccountManagement: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [editingAdmin, setEditingAdmin] = useState<AdminItem | null>(null);

    const columns: ProColumns<AdminItem>[] = [
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '姓名',
            dataIndex: 'name',
            search: false,
        },
        {
            title: '手机号',
            dataIndex: 'mobile',
            search: false,
        },
        {
            title: '角色',
            dataIndex: 'role',
            render: (_, record) => (
                <Tag color={roleColors[record.role]}>
                    {roleLabels[record.role] || record.role}
                </Tag>
            ),
            valueType: 'select',
            valueEnum: {
                super_admin: { text: '超级管理员' },
                admin: { text: '管理员' },
                operator: { text: '操作员' },
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
                        await request(`/api/admins/${record.id}`, {
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
            title: '最后登录',
            dataIndex: 'lastLoginAt',
            search: false,
            render: (_, record) =>
                record.lastLoginAt ? new Date(record.lastLoginAt).toLocaleString() : '-',
        },
        {
            title: '操作',
            valueType: 'option',
            render: (_, record) => [
                <a key="edit" onClick={() => setEditingAdmin(record)}>编辑</a>,
                <Popconfirm
                    key="delete"
                    title="确定删除该账号吗？"
                    onConfirm={async () => {
                        await request(`/api/admins/${record.id}`, { method: 'DELETE' });
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
            <ProTable<AdminItem>
                headerTitle="账号管理"
                actionRef={actionRef}
                rowKey="id"
                columns={columns}
                request={async (params) => {
                    const res = await request<{ data: AdminItem[]; total: number }>('/api/admins', {
                        params: {
                            current: params.current,
                            pageSize: params.pageSize,
                            role: params.role,
                        },
                    });
                    return { data: res.data, total: res.total, success: true };
                }}
                toolBarRender={() => [
                    <ModalForm
                        key="create"
                        title="添加账号"
                        trigger={<Button type="primary" icon={<PlusOutlined />}>添加账号</Button>}
                        width={500}
                        onFinish={async (values) => {
                            try {
                                await request('/api/admins', { method: 'POST', data: values });
                                message.success('创建成功');
                                actionRef.current?.reload();
                                return true;
                            } catch (e: any) {
                                message.error(e.message || '创建失败');
                                return false;
                            }
                        }}
                    >
                        <ProFormText name="username" label="用户名" rules={[{ required: true }]} placeholder="请输入用户名" />
                        <ProFormText.Password name="password" label="密码" rules={[{ required: true, min: 6, message: '密码至少6位' }]} placeholder="请输入密码" />
                        <ProFormText name="name" label="姓名" placeholder="请输入姓名" />
                        <ProFormText name="mobile" label="手机号" placeholder="请输入手机号" />
                        <ProFormSelect name="role" label="角色" options={roleOptions} initialValue="admin" rules={[{ required: true }]} />
                    </ModalForm>,
                ]}
                pagination={{ pageSize: 20 }}
            />

            <ModalForm
                title="编辑账号"
                open={!!editingAdmin}
                onOpenChange={(open) => !open && setEditingAdmin(null)}
                initialValues={editingAdmin || {}}
                width={500}
                onFinish={async (values) => {
                    try {
                        await request(`/api/admins/${editingAdmin?.id}`, { method: 'PUT', data: values });
                        message.success('更新成功');
                        setEditingAdmin(null);
                        actionRef.current?.reload();
                        return true;
                    } catch (e: any) {
                        message.error(e.message || '更新失败');
                        return false;
                    }
                }}
            >
                <ProFormText name="name" label="姓名" />
                <ProFormText name="mobile" label="手机号" />
                <ProFormSelect name="role" label="角色" options={roleOptions} />
                <ProFormText.Password name="password" label="新密码" placeholder="留空则不修改密码" extra="留空则不修改密码" />
            </ModalForm>
        </PageContainer>
    );
};

export default AccountManagement;
