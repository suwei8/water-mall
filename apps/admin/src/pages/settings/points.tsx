import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Form, InputNumber, Button, message, Spin } from 'antd';
import { request } from '@umijs/max';

const PointsSettings: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const res = await request<any>('/api/configs/template');
            const pointsConfigs = res.POINTS || [];

            const values: any = {};
            pointsConfigs.forEach((item: any) => {
                values[item.key] = item.value ? Number(item.value) : 0;
            });

            form.setFieldsValue(values);
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
            await request('/api/configs/POINTS', {
                method: 'PUT',
                data: {
                    earnRatio: String(values.earnRatio || 0),
                    useRatio: String(values.useRatio || 0),
                    signinDaily: String(values.signinDaily || 0),
                },
            });
            message.success('保存成功');
        } catch (e) {
            message.error('保存失败');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <PageContainer><Spin size="large" /></PageContainer>;

    return (
        <PageContainer>
            <Card title="积分设置">
                <Form form={form} layout="vertical" style={{ maxWidth: 500 }}>
                    <Form.Item
                        name="earnRatio"
                        label="消费积分比例"
                        extra="消费多少元获得1积分，例如填10表示消费10元获得1积分"
                    >
                        <InputNumber min={0} addonAfter="元得1积分" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="useRatio"
                        label="积分抵扣比例"
                        extra="多少积分可抵扣1元，例如填100表示100积分抵1元"
                    >
                        <InputNumber min={0} addonAfter="积分抵1元" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="signinDaily"
                        label="每日签到积分"
                        extra="用户每日签到可获得的积分数"
                    >
                        <InputNumber min={0} addonAfter="积分" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={handleSave} loading={saving}>
                            保存设置
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </PageContainer>
    );
};

export default PointsSettings;
