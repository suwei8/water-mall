import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { ProTable, DrawerForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Image, Upload, Form, Input, Space, Card, Divider } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { request } from '@umijs/max';
import { useState, useRef, useEffect } from 'react';
import type { ActionType } from '@ant-design/pro-components';

const { TextArea } = Input;

const ProductList: React.FC = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [description, setDescription] = useState('');
    const actionRef = useRef<ActionType>();
    const [form] = Form.useForm();

    useEffect(() => {
        request('/api/categories').then(setCategories);
    }, []);

    useEffect(() => {
        if (editingProduct) {
            const specs = editingProduct.specs ?
                (typeof editingProduct.specs === 'string' ? JSON.parse(editingProduct.specs) : editingProduct.specs) :
                [];
            const skus = editingProduct.skus ?
                (typeof editingProduct.skus === 'string' ? JSON.parse(editingProduct.skus) : editingProduct.skus) :
                [];

            form.setFieldsValue({
                name: editingProduct.name,
                categoryId: editingProduct.categoryId,
                specs: specs.length > 0 ? specs.map((s: any) => ({
                    name: s.name,
                    options: Array.isArray(s.options) ? s.options.join(',') : s.options
                })) : [{ name: '', options: '' }],
                skus: skus.length > 0 ? skus : [{ spec: '', price: 0, stock: 999 }],
            });
            setDescription(editingProduct.description || '');
            setFileList(editingProduct.images?.map((url: string, i: number) => ({
                uid: `-${i}`,
                name: `image-${i}`,
                status: 'done' as const,
                url,
            })) || []);
        } else {
            form.resetFields();
            form.setFieldsValue({
                specs: [{ name: '', options: '' }],
                skus: [{ spec: '', price: 0, stock: 999 }],
            });
            setDescription('');
            setFileList([]);
        }
    }, [editingProduct, form]);

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 80, ellipsis: true },
        {
            title: '商品图片',
            dataIndex: 'images',
            width: 100,
            render: (images: string[]) => images?.[0] ? <Image src={images[0]} width={60} /> : '-'
        },
        { title: '商品名称', dataIndex: 'name', width: 200 },
        { title: '分类', dataIndex: ['category', 'name'], width: 100 },
        { title: '销量', dataIndex: 'sales', width: 80 },
        { title: '创建时间', dataIndex: 'createdAt', valueType: 'dateTime', width: 180 },
        {
            title: '操作',
            width: 150,
            render: (_: any, record: any) => (
                <>
                    <a onClick={() => { setEditingProduct(record); setDrawerVisible(true); }}>编辑</a>
                    <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ marginLeft: 8, color: 'red' }}>删除</a>
                    </Popconfirm>
                </>
            ),
        },
    ];

    const fetchProducts = async (params: any) => {
        const res = await request('/api/products', {
            params: { skip: (params.current - 1) * params.pageSize, take: params.pageSize },
        });
        return { data: res.items, total: res.total, success: true };
    };

    const handleDelete = async (id: string) => {
        await request(`/api/products/${id}`, { method: 'DELETE' });
        message.success('删除成功');
        actionRef.current?.reload();
    };

    const handleSubmit = async (values: any) => {
        const method = editingProduct ? 'PUT' : 'POST';
        const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';

        // Transform specs to proper format
        const specs = values.specs?.map((s: any) => ({
            name: s.name,
            options: typeof s.options === 'string' ? s.options.split(',').map((o: string) => o.trim()).filter(Boolean) : (s.options || [])
        })).filter((s: any) => s.name) || [];

        // Transform SKUs
        const skus = values.skus?.map((s: any) => ({
            spec: s.spec,
            price: parseFloat(s.price) || 0,
            stock: parseInt(s.stock) || 999,
        })).filter((s: any) => s.spec) || [];

        // Get image URLs from fileList
        const images = fileList.map(f => f.url || f.response?.url || '').filter(Boolean);

        await request(url, {
            method,
            data: {
                name: values.name,
                categoryId: values.categoryId,
                description,
                images,
                specs: JSON.stringify(specs),
                skus: JSON.stringify(skus),
            },
        });
        message.success(editingProduct ? '更新成功' : '创建成功');
        setDrawerVisible(false);
        setEditingProduct(null);
        actionRef.current?.reload();
        return true;
    };

    const uploadProps = {
        name: 'file',
        action: '/api/upload',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        onChange(info: any) {
            let newFileList = [...info.fileList];
            newFileList = newFileList.map(file => {
                if (file.response) {
                    file.url = file.response.url;
                }
                return file;
            });
            setFileList(newFileList);
        },
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传图片</div>
        </div>
    );

    return (
        <>
            <ProTable
                columns={columns}
                request={fetchProducts}
                actionRef={actionRef}
                rowKey="id"
                search={false}
                toolBarRender={() => [
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingProduct(null); setDrawerVisible(true); }}>
                        新建商品
                    </Button>,
                ]}
            />
            <DrawerForm
                title={editingProduct ? '编辑商品' : '新建商品'}
                width={720}
                open={drawerVisible}
                onOpenChange={(open) => {
                    setDrawerVisible(open);
                    if (!open) {
                        setEditingProduct(null);
                    }
                }}
                form={form}
                onFinish={handleSubmit}
                drawerProps={{ destroyOnClose: true }}
            >
                <ProFormText name="name" label="商品名称" rules={[{ required: true, message: '请输入商品名称' }]} />

                <ProFormSelect
                    name="categoryId"
                    label="商品分类"
                    options={categories.map(c => ({ label: c.name, value: c.id }))}
                    placeholder="请选择分类"
                />

                {/* Image Upload */}
                <Form.Item label="商品图片" extra="支持jpg、png格式，可上传多张">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        {...uploadProps}
                        onRemove={(file) => {
                            setFileList(prev => prev.filter(f => f.uid !== file.uid));
                        }}
                    >
                        {fileList.length >= 5 ? null : uploadButton}
                    </Upload>
                </Form.Item>

                {/* Description */}
                <Form.Item label="商品详情">
                    <TextArea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        placeholder="请输入商品详情描述..."
                    />
                </Form.Item>

                <Divider>规格设置</Divider>

                {/* Specs Editor */}
                <Form.List name="specs">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Card key={key} size="small" style={{ marginBottom: 8 }}
                                    extra={<MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />}
                                >
                                    <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item {...restField} name={[name, 'name']} label="规格名" style={{ marginBottom: 0 }}>
                                            <Input placeholder="如: 容量" style={{ width: 120 }} />
                                        </Form.Item>
                                        <Form.Item {...restField} name={[name, 'options']} label="选项(逗号分隔)" style={{ marginBottom: 0 }}>
                                            <Input placeholder="如: 10L,18L,20L" style={{ width: 250 }} />
                                        </Form.Item>
                                    </Space>
                                </Card>
                            ))}
                            <Button type="dashed" onClick={() => add({ name: '', options: '' })} block icon={<PlusOutlined />}>
                                添加规格
                            </Button>
                        </>
                    )}
                </Form.List>

                <Divider>SKU价格设置</Divider>

                {/* SKU Editor */}
                <Form.List name="skus">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item {...restField} name={[name, 'spec']} label="规格值">
                                        <Input placeholder="如: 18L" style={{ width: 120 }} />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'price']} label="价格">
                                        <Input type="number" placeholder="0.00" style={{ width: 100 }} prefix="¥" />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'stock']} label="库存">
                                        <Input type="number" placeholder="999" style={{ width: 80 }} />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                                </Space>
                            ))}
                            <Button type="dashed" onClick={() => add({ spec: '', price: 0, stock: 999 })} block icon={<PlusOutlined />}>
                                添加SKU
                            </Button>
                        </>
                    )}
                </Form.List>
            </DrawerForm>
        </>
    );
};

export default ProductList;
