import React, { useEffect, useState } from 'react';
import { PageContainer, ProForm, ProFormText } from '@ant-design/pro-components';
import { Card, message, Upload, Button, Avatar } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';

interface ShopSettings {
    id: string;
    name: string;
    logo?: string;
}

const ShopSettingsPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState<ShopSettings | null>(null);
    const [logo, setLogo] = useState<string>('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await request<ShopSettings>('/api/shops/current');
            setInitialValues(res);
            setLogo(res.logo || '');
        } catch (e) {
            message.error('加载设置失败');
        }
    };

    const handleSubmit = async (values: any) => {
        if (!initialValues?.id) return;
        setLoading(true);
        try {
            await request(`/api/shops/${initialValues.id}`, {
                method: 'PUT',
                data: {
                    ...values,
                    logo,
                },
            });
            message.success('保存成功');
        } catch (e) {
            message.error('保存失败');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (info: any) => {
        if (info.file.status === 'done') {
            const url = info.file.response?.url;
            if (url) {
                setLogo(url);
                message.success('上传成功');
            }
        } else if (info.file.status === 'error') {
            message.error('上传失败');
        }
    };

    if (!initialValues) {
        return <PageContainer loading />;
    }

    return (
        <PageContainer>
            <Card>
                <ProForm
                    initialValues={initialValues}
                    onFinish={handleSubmit}
                    submitter={{
                        searchConfig: { submitText: '保存设置' },
                        resetButtonProps: { style: { display: 'none' } },
                    }}
                >
                    <ProFormText
                        name="name"
                        label="店铺名称"
                        rules={[{ required: true, message: '请输入店铺名称' }]}
                        width="md"
                    />

                    <ProForm.Item label="店铺Logo">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            {logo && (
                                <Avatar src={logo} size={64} shape="square" />
                            )}
                            <Upload
                                name="file"
                                action="/api/upload"
                                showUploadList={false}
                                onChange={handleUpload}
                                headers={{
                                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                                }}
                            >
                                <Button icon={<UploadOutlined />}>上传Logo</Button>
                            </Upload>
                        </div>
                    </ProForm.Item>
                </ProForm>
            </Card>
        </PageContainer>
    );
};

export default ShopSettingsPage;
