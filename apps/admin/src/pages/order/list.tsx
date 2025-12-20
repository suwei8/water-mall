import { ProTable } from '@ant-design/pro-components';
import { Tag, message, Select } from 'antd';
import { request } from '@umijs/max';
import { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-components';

const statusMap: Record<string, { text: string; color: string }> = {
    PENDING: { text: '待支付', color: 'orange' },
    PAID: { text: '已支付', color: 'blue' },
    DISPATCHED: { text: '已派单', color: 'cyan' },
    DELIVERING: { text: '配送中', color: 'geekblue' },
    COMPLETED: { text: '已完成', color: 'green' },
    CANCELLED: { text: '已取消', color: 'red' },
};

const OrderList: React.FC = () => {
    const actionRef = useRef<ActionType>();

    const handleStatusChange = async (id: string, status: string) => {
        await request(`/api/orders/${id}/status`, { method: 'PUT', data: { status } });
        message.success('状态更新成功');
        actionRef.current?.reload();
    };

    const columns = [
        { title: '订单ID', dataIndex: 'id', width: 280, ellipsis: true },
        { title: '用户', dataIndex: ['user', 'name'], width: 100 },
        { title: '手机号', dataIndex: ['user', 'mobile'], width: 120 },
        {
            title: '订单金额',
            dataIndex: 'payAmount',
            width: 100,
            render: (amount: number) => `¥${amount}`
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            render: (status: string) => {
                const s = statusMap[status] || { text: status, color: 'default' };
                return <Tag color={s.color}>{s.text}</Tag>;
            }
        },
        { title: '创建时间', dataIndex: 'createdAt', valueType: 'dateTime', width: 180 },
        {
            title: '操作',
            width: 180,
            render: (_: any, record: any) => (
                <Select
                    value={record.status}
                    style={{ width: 120 }}
                    onChange={(v) => handleStatusChange(record.id, v)}
                    options={Object.entries(statusMap).map(([k, v]) => ({ value: k, label: v.text }))}
                />
            ),
        },
    ];

    const fetchOrders = async (params: any) => {
        const res = await request('/api/orders', {
            params: { skip: (params.current - 1) * params.pageSize, take: params.pageSize },
        });
        return { data: res.items, total: res.total, success: true };
    };

    return (
        <ProTable
            columns={columns}
            request={fetchOrders}
            actionRef={actionRef}
            rowKey="id"
            search={false}
        />
    );
};

export default OrderList;
