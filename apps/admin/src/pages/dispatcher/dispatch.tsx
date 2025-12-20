import React, { useRef, useState, useEffect } from 'react';
import { PageContainer, ProTable, ModalForm, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Tag, message, Card, Row, Col, Statistic, Modal } from 'antd';
import { request } from '@umijs/max';

interface OrderItem {
    id: string;
    status: string;
    totalAmount: number;
    payAmount: number;
    items: any;
    dispatchInfo?: any;
    createdAt: string;
}

interface DispatchItem {
    id: string;
    orderId: string;
    dispatcherId: string;
    status: string;
    assignedAt: string;
    dispatcher: { name: string; phone: string };
}

interface DispatcherOption {
    id: string;
    name: string;
    phone: string;
    status: string;
}

const statusLabels: Record<string, { text: string; color: string }> = {
    ASSIGNED: { text: '已派单', color: 'blue' },
    ACCEPTED: { text: '已接单', color: 'cyan' },
    DELIVERING: { text: '配送中', color: 'orange' },
    COMPLETED: { text: '已完成', color: 'green' },
    CANCELLED: { text: '已取消', color: 'red' },
};

const DispatchPage: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const pendingRef = useRef<ActionType>();
    const [pendingOrders, setPendingOrders] = useState<OrderItem[]>([]);
    const [dispatchers, setDispatchers] = useState<DispatcherOption[]>([]);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

    useEffect(() => {
        loadDispatchers();
        loadPendingOrders();
    }, []);

    const loadDispatchers = async () => {
        try {
            const res = await request<{ data: DispatcherOption[] }>('/api/dispatchers', { params: { status: 'ACTIVE' } });
            setDispatchers(res.data || []);
        } catch (e) { }
    };

    const loadPendingOrders = async () => {
        try {
            const res = await request<OrderItem[]>('/api/dispatchers/pending-orders');
            setPendingOrders(res || []);
        } catch (e) { }
    };

    const pendingColumns: ProColumns<OrderItem>[] = [
        { title: '订单号', dataIndex: 'id', render: (_, r) => r.id.slice(0, 8) + '...' },
        { title: '金额', dataIndex: 'payAmount', render: (_, r) => `¥${Number(r.payAmount).toFixed(2)}` },
        { title: '下单时间', dataIndex: 'createdAt', valueType: 'dateTime' },
        {
            title: '操作',
            valueType: 'option',
            render: (_, record) => [
                <a key="assign" onClick={() => {
                    setSelectedOrder(record);
                    setAssignModalOpen(true);
                }}>派单</a>,
            ],
        },
    ];

    const dispatchColumns: ProColumns<DispatchItem>[] = [
        { title: '订单号', dataIndex: 'orderId', render: (_, r) => r.orderId.slice(0, 8) + '...' },
        { title: '配送员', dataIndex: ['dispatcher', 'name'] },
        { title: '电话', dataIndex: ['dispatcher', 'phone'] },
        {
            title: '状态',
            dataIndex: 'status',
            render: (_, r) => {
                const s = statusLabels[r.status] || { text: r.status, color: 'default' };
                return <Tag color={s.color}>{s.text}</Tag>;
            },
        },
        { title: '派单时间', dataIndex: 'assignedAt', valueType: 'dateTime' },
        {
            title: '操作',
            valueType: 'option',
            render: (_, record) => {
                if (record.status === 'COMPLETED' || record.status === 'CANCELLED') return '-';
                return [
                    <a key="complete" onClick={async () => {
                        await request(`/api/dispatchers/dispatches/${record.id}/status`, {
                            method: 'POST',
                            data: { status: 'COMPLETED' }
                        });
                        message.success('已完成');
                        actionRef.current?.reload();
                    }}>完成</a>,
                ];
            },
        },
    ];

    const handleAssign = async (values: { dispatcherId: string; note?: string }) => {
        if (!selectedOrder) return false;
        try {
            await request('/api/dispatchers/assign', {
                method: 'POST',
                data: {
                    orderId: selectedOrder.id,
                    dispatcherId: values.dispatcherId,
                    note: values.note,
                },
            });
            message.success('派单成功');
            setAssignModalOpen(false);
            setSelectedOrder(null);
            loadPendingOrders();
            actionRef.current?.reload();
            return true;
        } catch (e) {
            return false;
        }
    };

    return (
        <PageContainer>
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={8}>
                    <Card>
                        <Statistic title="待派单" value={pendingOrders.length} suffix="单" valueStyle={{ color: '#1890ff' }} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="在线配送员" value={dispatchers.length} suffix="人" valueStyle={{ color: '#52c41a' }} />
                    </Card>
                </Col>
            </Row>

            <Card title="待派单订单" style={{ marginBottom: 16 }}>
                <ProTable<OrderItem>
                    actionRef={pendingRef}
                    rowKey="id"
                    columns={pendingColumns}
                    dataSource={pendingOrders}
                    search={false}
                    toolBarRender={false}
                    pagination={false}
                />
            </Card>

            <Card title="派单记录">
                <ProTable<DispatchItem>
                    actionRef={actionRef}
                    rowKey="id"
                    columns={dispatchColumns}
                    request={async (params) => {
                        const res = await request<{ data: DispatchItem[]; total: number }>('/api/dispatchers/dispatches', {
                            params: { current: params.current, pageSize: params.pageSize },
                        });
                        return { data: res.data, total: res.total, success: true };
                    }}
                    search={false}
                    pagination={{ pageSize: 20 }}
                />
            </Card>

            <ModalForm
                title="派单"
                open={assignModalOpen}
                onOpenChange={setAssignModalOpen}
                onFinish={handleAssign}
            >
                <ProFormSelect
                    name="dispatcherId"
                    label="选择配送员"
                    rules={[{ required: true, message: '请选择配送员' }]}
                    options={dispatchers.map(d => ({ label: `${d.name} (${d.phone})`, value: d.id }))}
                />
                <ProFormTextArea name="note" label="备注" placeholder="选填" />
            </ModalForm>
        </PageContainer>
    );
};

export default DispatchPage;
