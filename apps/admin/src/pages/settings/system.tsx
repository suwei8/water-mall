import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Form, Input, InputNumber, Select, Upload, Button, message, Spin, Image, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';

const SystemConfig: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [shareImage, setShareImage] = useState('');
    const [bucketImage, setBucketImage] = useState('');

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const res = await request<any>('/api/configs/template');
            const shareConfigs = res.SHARE || [];
            const bucketConfigs = res.BUCKET_DEPOSIT || [];
            const orderConfigs = res.ORDER || [];

            const values: any = {};
            [...shareConfigs, ...bucketConfigs, ...orderConfigs].forEach((item: any) => {
                values[`${item.category}_${item.key}`] = item.value;
            });

            form.setFieldsValue(values);
            setShareImage(values.SHARE_poster || '');
            setBucketImage(values.BUCKET_DEPOSIT_productImage || '');
        } catch (e) {
            message.error('加载配置失败');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        const values = await form.validateFields();
        setSaving(true);
        try {
            // 分享设置
            await request('/api/configs/SHARE', {
                method: 'PUT',
                data: {
                    poster: shareImage,
                    description: values.SHARE_description,
                },
            });

            // 押桶设置
            await request('/api/configs/BUCKET_DEPOSIT', {
                method: 'PUT',
                data: {
                    required: values.BUCKET_DEPOSIT_required,
                    memberRequired: values.BUCKET_DEPOSIT_memberRequired,
                    quantity: values.BUCKET_DEPOSIT_quantity,
                    unitPrice: values.BUCKET_DEPOSIT_unitPrice,
                    productName: values.BUCKET_DEPOSIT_productName,
                    productImage: bucketImage,
                },
            });

            // 订单设置
            await request('/api/configs/ORDER', {
                method: 'PUT',
                data: {
                    minOrderQty: values.ORDER_minOrderQty,
                    maxDeliveryDistance: values.ORDER_maxDeliveryDistance,
                },
            });

            message.success('保存成功');
        } catch (e) {
            message.error('保存失败');
        } finally {
            setSaving(false);
        }
    };

    const handleUpload = (setImage: (url: string) => void) => (info: any) => {
        if (info.file.status === 'done') {
            setImage(info.file.response?.url || '');
            message.success('上传成功');
        }
    };

    if (loading) return <PageContainer><Spin size="large" /></PageContainer>;

    return (
        <PageContainer>
            <Card>
                <Form form={form} layout="vertical">
                    {/* 分享设置 */}
                    <h3>分享设置</h3>
                    <Form.Item label="分享海报 (建议400x400px)">
                        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                            {shareImage && <Image src={shareImage} width={100} height={100} />}
                            <Upload
                                name="file"
                                action="/api/upload"
                                showUploadList={false}
                                onChange={handleUpload(setShareImage)}
                                headers={{ Authorization: `Bearer ${localStorage.getItem('token')}` }}
                            >
                                <Button icon={<UploadOutlined />}>上传海报</Button>
                            </Upload>
                        </div>
                    </Form.Item>
                    <Form.Item name="SHARE_description" label="分享描述">
                        <Input placeholder="订水无忧，方便到家" />
                    </Form.Item>

                    <Divider />

                    {/* 押桶设置 */}
                    <h3>押桶设置</h3>
                    <Form.Item name="BUCKET_DEPOSIT_required" label="订水是否需要押桶">
                        <Select options={[{ label: '需要', value: 'true' }, { label: '不需要', value: 'false' }]} />
                    </Form.Item>
                    <Form.Item name="BUCKET_DEPOSIT_memberRequired" label="会员订水是否需要押桶" extra="会员指的是VIP等级大于0的所有等级">
                        <Select options={[{ label: '需要', value: 'true' }, { label: '不需要', value: 'false' }]} />
                    </Form.Item>
                    <Form.Item name="BUCKET_DEPOSIT_quantity" label="押桶数量">
                        <InputNumber min={0} addonAfter="桶" />
                    </Form.Item>
                    <Form.Item name="BUCKET_DEPOSIT_unitPrice" label="押桶押金单价">
                        <InputNumber min={0} precision={2} addonAfter="元/桶" />
                    </Form.Item>
                    <Form.Item name="BUCKET_DEPOSIT_productName" label="押桶押金条名称" extra="比如某某水押金">
                        <Input placeholder="桶押金" />
                    </Form.Item>
                    <Form.Item label="押桶押金条展示图片 (建议200x200px)">
                        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                            {bucketImage && <Image src={bucketImage} width={100} height={100} />}
                            <Upload
                                name="file"
                                action="/api/upload"
                                showUploadList={false}
                                onChange={handleUpload(setBucketImage)}
                                headers={{ Authorization: `Bearer ${localStorage.getItem('token')}` }}
                            >
                                <Button icon={<UploadOutlined />}>上传图片</Button>
                            </Upload>
                        </div>
                    </Form.Item>

                    <Divider />

                    {/* 订单设置 */}
                    <h3>订单设置</h3>
                    <Form.Item name="ORDER_minOrderQty" label="起订量">
                        <InputNumber min={1} addonAfter="桶" />
                    </Form.Item>
                    <Form.Item name="ORDER_maxDeliveryDistance" label="配送最大距离">
                        <InputNumber min={0} precision={2} addonAfter="km" />
                    </Form.Item>

                    <Divider />

                    <Button type="primary" onClick={handleSave} loading={saving}>确定保存</Button>
                </Form>
            </Card>
        </PageContainer>
    );
};

export default SystemConfig;
