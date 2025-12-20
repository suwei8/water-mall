import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Form, Input, Button, Tabs, message, Spin, Alert } from 'antd';
import { SaveOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';

interface ConfigItem {
    key: string;
    label: string;
    value: string;
    category: string;
}

interface ConfigTemplate {
    WECHAT_MP: ConfigItem[];
    WECHAT_OA: ConfigItem[];
    PAYMENT: ConfigItem[];
    NOTIFICATION: ConfigItem[];
}

const categoryLabels: Record<string, string> = {
    WECHAT_MP: '微信小程序',
    WECHAT_OA: '微信公众号',
    PAYMENT: '微信支付',
    NOTIFICATION: '消息模板',
};

const categoryDescriptions: Record<string, string> = {
    WECHAT_MP: '配置小程序的 AppID 和 AppSecret，用于小程序登录授权',
    WECHAT_OA: '配置公众号的 AppID 和 AppSecret，用于发送模板消息通知',
    PAYMENT: '配置微信支付商户号和密钥，用于订单支付',
    NOTIFICATION: '配置公众号模板消息ID，用于订单状态通知',
};

// 需要隐藏的敏感字段
const sensitiveFields = ['appSecret', 'mchKey'];

const SystemConfigPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [template, setTemplate] = useState<ConfigTemplate | null>(null);
    const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
    const [forms] = useState({
        WECHAT_MP: Form.useForm()[0],
        WECHAT_OA: Form.useForm()[0],
        PAYMENT: Form.useForm()[0],
        NOTIFICATION: Form.useForm()[0],
    });

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const res = await request<ConfigTemplate>('/api/configs/template');
            setTemplate(res);

            // 设置表单初始值
            Object.entries(res).forEach(([category, items]) => {
                const values: Record<string, string> = {};
                items.forEach((item: ConfigItem) => {
                    values[item.key] = item.value;
                });
                forms[category as keyof typeof forms]?.setFieldsValue(values);
            });
        } catch (e) {
            message.error('加载配置失败');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (category: string) => {
        const form = forms[category as keyof typeof forms];
        try {
            const values = await form.validateFields();
            setSaving(category);

            await request(`/api/configs/${category}`, {
                method: 'POST',
                data: values,
            });

            message.success('保存成功');
        } catch (e) {
            message.error('保存失败');
        } finally {
            setSaving(null);
        }
    };

    const toggleSecret = (key: string) => {
        setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const renderConfigForm = (category: string, items: ConfigItem[]) => {
        const form = forms[category as keyof typeof forms];

        return (
            <Card>
                <Alert
                    message={categoryDescriptions[category]}
                    type="info"
                    showIcon
                    style={{ marginBottom: 24 }}
                />
                <Form form={form} layout="vertical">
                    {items.map(item => {
                        const isSensitive = sensitiveFields.includes(item.key);
                        const isVisible = showSecrets[`${category}_${item.key}`];

                        return (
                            <Form.Item
                                key={item.key}
                                name={item.key}
                                label={item.label}
                            >
                                <Input.Group compact style={{ display: 'flex' }}>
                                    <Input
                                        type={isSensitive && !isVisible ? 'password' : 'text'}
                                        placeholder={`请输入${item.label}`}
                                        style={{ flex: 1 }}
                                    />
                                    {isSensitive && (
                                        <Button
                                            icon={isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                            onClick={() => toggleSecret(`${category}_${item.key}`)}
                                        />
                                    )}
                                </Input.Group>
                            </Form.Item>
                        );
                    })}
                    <Form.Item>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            loading={saving === category}
                            onClick={() => handleSave(category)}
                        >
                            保存{categoryLabels[category]}配置
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        );
    };

    if (loading || !template) {
        return (
            <PageContainer>
                <div style={{ textAlign: 'center', padding: 100 }}>
                    <Spin size="large" />
                </div>
            </PageContainer>
        );
    }

    const tabItems = Object.entries(template).map(([category, items]) => ({
        key: category,
        label: categoryLabels[category],
        children: renderConfigForm(category, items),
    }));

    return (
        <PageContainer
            header={{
                title: '系统配置',
                subTitle: '配置微信小程序、公众号、支付和消息模板',
            }}
        >
            <Tabs items={tabItems} />
        </PageContainer>
    );
};

export default SystemConfigPage;
