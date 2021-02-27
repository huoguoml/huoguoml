import * as React from 'react';
import { Breadcrumb, Button, Dropdown, Layout, Menu, Space } from 'antd';
import { DesktopOutlined, ExperimentOutlined } from '@ant-design/icons';

interface Props {
  content?: React.ReactNode;
}

export const AppLayout = React.memo((props: Props) => {
  const { Header, Content, Footer, Sider } = Layout;
  const { SubMenu } = Menu;
  const [collapsed, setCollapsed] = React.useState(false);

  const [language, setLanguage] = React.useState('English');

  const menu = (
    <Menu>
      <Menu.Item onClick={() => setLanguage('German')}>German</Menu.Item>
      <Menu.Item onClick={() => setLanguage('Chinese')}>Chinese</Menu.Item>
    </Menu>
  );

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          breakpoint="lg"
          collapsible
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <SubMenu
              key="experiments"
              title="Experiments"
              icon={<ExperimentOutlined />}
            >
              <Menu.Item key="all">All experiments</Menu.Item>
              <Menu.Item key="1">Experiment 1</Menu.Item>
              <Menu.Item key="2">Experiment 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="services" icon={<DesktopOutlined />}>
              Services
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{
              height: 48,
            }}
          >
            <Space align={'end'}>
              <Dropdown overlay={menu} placement="bottomCenter">
                <Button>{language}</Button>
              </Dropdown>
            </Space>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Experiments</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: '100%' }}
            >
              {props.content}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            HuoguoML - Created by Data Scientist for Data Scientist
          </Footer>
        </Layout>
      </Layout>
    </>
  );
});
