import { PlusOutlined } from '@ant-design/icons';
import { ProTable, ModalForm, ProFormText, ProFormDigit } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { request } from '@umijs/max';
import { useState, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-components';

const CategoryList: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const actionRef = useRef<ActionType>();

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 280, ellipsis: true },
        { title: '分类名称', dataIndex: 'name', width: 200 },
        { title: '排序', dataIndex: 'sort', width: 80 },
        { title: '创建时间', dataIndex: 'createdAt', valueType: 'dateTime', width: 180 },
        {
            title: '操作',
            width: 150,
            render: (_: any, record: any) => (
                <>
                    <a onClick={() => { setEditingCategory(record); setModalVisible(true); }}>编辑</a>
                    <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ marginLeft: 8, color: 'red' }}>删除</a>
                    </Popconfirm>
                </>
            ),
        },
    ];

    const fetchCategories = async () => {
        const data = await request('/api/categories');
        return { data, success: true };
    };

    const handleDelete = async (id: string) => {
        await request(`/api/categories/${id}`, { method: 'DELETE' });
        message.success('删除成功');
        actionRef.current?.reload();
    };

    const handleSubmit = async (values: any) => {
        const method = editingCategory ? 'PUT' : 'POST';
        const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
        await request(url, { method, data: values });
        message.success(editingCategory ? '更新成功' : '创建成功');
        setModalVisible(false);
        setEditingCategory(null);
        actionRef.current?.reload();
        return true;
    };

    return (
        <>
            <ProTable
                columns={columns}
                request={fetchCategories}
                actionRef={actionRef}
                rowKey="id"
                search={false}
                pagination={false}
                toolBarRender={() => [
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingCategory(null); setModalVisible(true); }}>
                        新建分类
                    </Button>,
                ]}
            />
            <ModalForm
                title={editingCategory ? '编辑分类' : '新建分类'}
                open={modalVisible}
                onOpenChange={setModalVisible}
                onFinish={handleSubmit}
                initialValues={editingCategory}
            >
                <ProFormText name="name" label="分类名称" rules={[{ required: true }]} />
                <ProFormDigit name="sort" label="排序" min={0} initialValue={0} />
            </ModalForm>
        </>
    );
};

export default CategoryList;
