import * as React from 'react';
import { Layout, Menu } from 'antd';
import {
  DesktopOutlined,
  ExperimentOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useAppLayoutSlice } from './slice';
import { selectAppLayout } from './slice/selectors';
import { Route, Switch, useHistory } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage/Loadable';
import { ExperimentPage } from '../pages/ExperimentPage/Loadable';
import { NotFoundPage } from '../components/NotFoundPage/Loadable';
import { ExperimentRunPage } from '../pages/ExperimentRunPage/Loadable';

export const AppLayout = React.memo(() => {
  const dispatch = useDispatch();
  const { actions } = useAppLayoutSlice();

  const appLayoutState = useSelector(selectAppLayout);

  React.useEffect(() => {
    dispatch(actions.getLayoutState());
  }, [dispatch, actions]);

  const { Header, Content, Footer, Sider } = Layout;
  const { SubMenu } = Menu;
  const [collapsed, setCollapsed] = React.useState(false);

  let history = useHistory();

  function toDashboardPage() {
    history.push(`/`);
  }

  function toExperimentPageWithId(experimentName?: string) {
    history.push(`/experiments/${experimentName}`);
  }

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          breakpoint="lg"
          collapsible
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['dashboard']} mode="inline">
            <Menu.Item
              onClick={toDashboardPage}
              key="dashboard"
              icon={<HomeOutlined />}
            >
              Dashboard
            </Menu.Item>
            <SubMenu
              key="experiments"
              title="Experiments"
              icon={<ExperimentOutlined />}
            >
              {appLayoutState.experiments?.map(experiment => (
                <Menu.Item
                  onClick={() => toExperimentPageWithId(experiment.name)}
                  key={experiment.id}
                >
                  {experiment.name}
                </Menu.Item>
              ))}
            </SubMenu>
            <Menu.Item key="services" icon={<DesktopOutlined />}>
              Services
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout
          className="site-layout"
          style={collapsed ? { marginLeft: 80 } : { marginLeft: 200 }}
        >
          <Header className="site-layout-background">
            <Menu theme="light" mode="horizontal" defaultSelectedKeys={['2']}>
              <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: '100%', margin: '16px 0' }}
            >
              <Switch>
                <Route exact path="/" component={DashboardPage} />
                <Route
                  exact
                  path="/experiments/:experimentName"
                  component={ExperimentPage}
                />
                <Route
                  exact
                  path="/experiments/:experimentName/:runId"
                  component={ExperimentRunPage}
                />
                <Route component={NotFoundPage} />
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            HuoguoML - Made by Data Scientist for Data Scientist
          </Footer>
        </Layout>
      </Layout>
    </>
  );
});
