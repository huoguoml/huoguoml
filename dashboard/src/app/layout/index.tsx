import * as React from 'react';
import { Breadcrumb, Layout, Menu } from 'antd';
import {
  DesktopOutlined,
  ExperimentOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useAppLayoutSlice } from './slice';
import { selectAppLayout } from './slice/selectors';
import { Route, Switch } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage/Loadable';
import { ExperimentPage } from '../pages/ExperimentPage/Loadable';
import { NotFoundPage } from '../components/NotFoundPage/Loadable';
import { useHistory } from 'react-router-dom';

interface Props {}

export const AppLayout = React.memo((props: Props) => {
  const dispatch = useDispatch();
  const { actions } = useAppLayoutSlice();

  const appLayoutState = useSelector(selectAppLayout);

  React.useEffect(() => {
    dispatch(actions.getLayoutState());
  }, [dispatch]);

  const { Header, Content, Footer, Sider } = Layout;
  const { SubMenu } = Menu;
  const [collapsed, setCollapsed] = React.useState(false);

  let history = useHistory();

  function toDashboardPage() {
    history.push(`/`);
  }
  function toExperimentPage() {
    history.push(`/experiments`);
  }
  function toExperimentPageWithId(experimentId?: number) {
    history.push(`/experiments/${experimentId}`);
  }
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
              <Menu.Item key="all" onClick={toExperimentPage}>
                all
              </Menu.Item>
              {appLayoutState.experiments?.map(experiment => (
                <Menu.Item
                  onClick={() => toExperimentPageWithId(experiment.id)}
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
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{
              height: 48,
            }}
          />
          <Content style={{ margin: '0 16px' }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: '100%', margin: '16px 0' }}
            >
              <Switch>
                <Route exact path="/" component={DashboardPage} />
                <Route exact path="/experiments" component={ExperimentPage} />
                <Route
                  path="/experiments/:experimentId"
                  component={ExperimentPage}
                />
                <Route component={NotFoundPage} />
              </Switch>
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
