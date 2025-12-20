import { PageContainer, StatisticCard } from '@ant-design/pro-components';
import { Card, Row, Col, theme, Spin } from 'antd';
import { ShoppingOutlined, TeamOutlined, FileTextOutlined, DollarOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { request } from '@umijs/max';

interface StatsOverview {
  totalOrders: number;
  todayOrders: number;
  totalSales: string;
  todaySales: string;
  totalUsers: number;
  totalProducts: number;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => {
  const { token } = theme.useToken();

  return (
    <Card style={{ height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: token.colorTextSecondary, fontSize: 14 }}>{title}</div>
          <div style={{ fontSize: 28, fontWeight: 600, marginTop: 8, color }}>{value}</div>
        </div>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 8,
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          color
        }}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsOverview | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await request<StatsOverview>('/api/stats/overview');
      setStats(res);
    } catch (e) {
      console.error('Failed to load stats', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: 100 }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 600, color: token.colorTextHeading }}>
          欢迎回来 👋
        </div>
        <div style={{ color: token.colorTextSecondary, marginTop: 8 }}>
          这是您的店铺数据概览
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="今日订单"
            value={stats?.todayOrders || 0}
            icon={<FileTextOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="今日销售额"
            value={`¥${stats?.todaySales || '0.00'}`}
            icon={<DollarOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="总订单数"
            value={stats?.totalOrders || 0}
            icon={<ShoppingOutlined />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="客户数"
            value={stats?.totalUsers || 0}
            icon={<TeamOutlined />}
            color="#fa8c16"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="累计销售额">
            <StatisticCard.Statistic
              title=""
              value={stats?.totalSales || '0.00'}
              prefix="¥"
              valueStyle={{ fontSize: 36, color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="商品数量">
            <StatisticCard.Statistic
              title=""
              value={stats?.totalProducts || 0}
              suffix="个"
              valueStyle={{ fontSize: 36, color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }} title="快捷入口">
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <a href="/order/list" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 20,
              borderRadius: 8,
              background: '#f5f5f5',
              textDecoration: 'none',
            }}>
              <FileTextOutlined style={{ fontSize: 32, color: '#1890ff' }} />
              <span style={{ marginTop: 8, color: token.colorText }}>订单管理</span>
            </a>
          </Col>
          <Col span={6}>
            <a href="/product/list" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 20,
              borderRadius: 8,
              background: '#f5f5f5',
              textDecoration: 'none',
            }}>
              <ShoppingOutlined style={{ fontSize: 32, color: '#52c41a' }} />
              <span style={{ marginTop: 8, color: token.colorText }}>商品管理</span>
            </a>
          </Col>
          <Col span={6}>
            <a href="/customer/list" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 20,
              borderRadius: 8,
              background: '#f5f5f5',
              textDecoration: 'none',
            }}>
              <TeamOutlined style={{ fontSize: 32, color: '#fa8c16' }} />
              <span style={{ marginTop: 8, color: token.colorText }}>客户管理</span>
            </a>
          </Col>
          <Col span={6}>
            <a href="/coupon/list" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 20,
              borderRadius: 8,
              background: '#f5f5f5',
              textDecoration: 'none',
            }}>
              <DollarOutlined style={{ fontSize: 32, color: '#722ed1' }} />
              <span style={{ marginTop: 8, color: token.colorText }}>营销管理</span>
            </a>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
