
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Table, Checkbox, Button, message, Space } from 'antd';
import { useEffect, useState } from 'react';
import { getRoleConstants, getRolePermissions, updateRolePermissions } from '@/services/ant-design-pro/api';

const ROLES = [
    { key: 'super_admin', label: '超级管理员 (Super Admin)' },
    { key: 'admin', label: '管理员 (Admin)' },
    { key: 'operator', label: '操作员 (Operator)' },
];

export default function RoleSettings() {
    const [permissionList, setPermissionList] = useState<any[]>([]);
    const [roleConfig, setRoleConfig] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [constRes, configRes] = await Promise.all([
                getRoleConstants(),
                getRolePermissions()
            ]);
            setPermissionList(constRes || []);
            // Ensure roleConfig has defaults if empty
            setRoleConfig(configRes || {});
        } catch (e) {
            message.error('加载权限配置失败');
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateRolePermissions(roleConfig);
            message.success('保存成功，权限将在用户下次登录或刷新后生效');
        } catch (e) {
            message.error('保存失败');
        }
        setLoading(false);
    };

    const togglePermission = (roleKey: string, code: string, checked: boolean) => {
        const currentperms = roleConfig[roleKey] || [];
        let newPerms;
        if (checked) {
            newPerms = [...currentperms, code];
        } else {
            newPerms = currentperms.filter((c) => c !== code);
        }
        setRoleConfig({ ...roleConfig, [roleKey]: newPerms });
    };

    const columns = [
        {
            title: '角色身份',
            dataIndex: 'label',
            key: 'label',
            fixed: 'left' as const,
            width: 200,
        },
        ...permissionList.map((p) => ({
            title: p.label,
            key: p.code,
            width: 150,
            render: (_: any, record: any) => {
                const isSuper = record.key === 'super_admin';
                const isChecked = isSuper || (roleConfig[record.key] || []).includes(p.code);

                return (
                    <Checkbox
                        checked={isChecked}
                        disabled={isSuper} // Super admin always has all permissions
                        onChange={(e) => togglePermission(record.key, p.code, e.target.checked)}
                    />
                );
            },
        })),
    ];

    return (
        <PageContainer>
            <ProCard
                title="角色权限配置"
                headerBordered
                extra={
                    <Button type="primary" loading={loading} onClick={handleSave}>
                        保存配置
                    </Button>
                }
            >
                <Table
                    rowKey="key"
                    loading={loading}
                    columns={columns}
                    dataSource={ROLES}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                />
            </ProCard>
        </PageContainer>
    );
}
