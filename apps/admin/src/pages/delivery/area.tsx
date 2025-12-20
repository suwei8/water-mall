import { PlusOutlined } from '@ant-design/icons';
import { ProTable, ModalForm, ProFormText, ProFormMoney } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag } from 'antd';
import { request } from '@umijs/max';
import { useState, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-components';

const DeliveryAreaList: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editingArea, setEditingArea] = useState<any>(null);
    const actionRef = useRef<ActionType>();

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 280, ellipsis: true },
        { title: '区域名称', dataIndex: 'name', width: 200 },
        {
            title: '配送费',
            dataIndex: 'fee',
            width: 100,
            render: (fee: number) => `¥${fee}`
        },
        {
            title: '状态',
            dataIndex: 'isActive',
            width: 80,
            render: (isActive: boolean) => isActive ? <Tag color="green">启用</Tag> : <Tag color="red">禁用</Tag>
        },
        { title: '创建时间', dataIndex: 'createdAt', valueType: 'dateTime', width: 180 },
        {
            title: '操作',
            width: 150,
            render: (_: any, record: any) => (
                <>
                    <a onClick={() => { setEditingArea(record); setModalVisible(true); }}>编辑</a>
                    <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ marginLeft: 8, color: 'red' }}>删除</a>
                    </Popconfirm>
                </>
            ),
        },
    ];

    const fetchAreas = async () => {
        const data = await request('/api/delivery-areas');
        return { data, success: true };
    };

    const handleDelete = async (id: string) => {
        await request(`/api/delivery-areas/${id}`, { method: 'DELETE' });
        message.success('删除成功');
        actionRef.current?.reload();
    };

    const handleSubmit = async (values: any) => {
        const method = editingArea ? 'PUT' : 'POST';
        const url = editingArea ? `/api/delivery-areas/${editingArea.id}` : '/api/delivery-areas';
        await request(url, {
            method,
            data: {
                ...values,
                polygon: values.polygon ? JSON.parse(values.polygon) : [],
            }
        });
        message.success(editingArea ? '更新成功' : '创建成功');
        setModalVisible(false);
        setEditingArea(null);
        actionRef.current?.reload();
        return true;
    };

    return (
        <>
            <ProTable
                columns={columns}
                request={fetchAreas}
                actionRef={actionRef}
                rowKey="id"
                search={false}
                pagination={false}
                toolBarRender={() => [
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingArea(null); setModalVisible(true); }}>
                        新建配送区域
                    </Button>,
                ]}
            />
            <ModalForm
                title={editingArea ? '编辑配送区域' : '新建配送区域'}
                open={modalVisible}
                onOpenChange={setModalVisible}
                onFinish={handleSubmit}
                initialValues={editingArea}
            >
                <ProFormText name="name" label="区域名称" rules={[{ required: true }]} />
                <ProFormMoney name="fee" label="配送费" min={0} initialValue={0} />
                <ProFormText name="polygon" label="区域坐标(JSON)" placeholder='[[lng,lat],[lng,lat],...]' />
            </ModalForm>
        </>
    );
};

export default DeliveryAreaList;
