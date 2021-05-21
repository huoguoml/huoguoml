import * as React from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  DesktopOutlined,
  ExperimentOutlined,
  HomeOutlined,
  // QuestionOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useAppLayoutSlice } from './slice';
import { selectAppLayout } from './slice/selectors';
import { Route, Switch, useHistory } from 'react-router-dom';
// import { DashboardPage } from '../../pages/DashboardPage/Loadable';
import { ExperimentPage } from '../../pages/ExperimentPage/Loadable';
import { NotFoundPage } from '../../components/NotFoundPage/Loadable';
import { ExperimentRunPage } from '../../pages/ExperimentRunPage/Loadable';
import { ServicesPage } from '../../pages/ServicesPage/Loadable';
import { HelpPage } from '../../pages/HelpPage/Loadable';
import { ModelPage } from '../../pages/ModelPage/Loadable';
import { CompareRunPage } from '../../pages/CompareRunPage/Loadable';
import { ModelDetailPage } from '../../pages/ModelDetailPage/Loadable';

export const AppLayout = React.memo(() => {
  const { Title } = Typography;

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

  function toExperimentPageWithName(experimentName?: string) {
    history.push(`/experiments/${experimentName}`);
  }

  function toModelPage() {
    history.push(`/models`);
  }

  function toServicesPage() {
    history.push('/services');
  }

  // function toHelpPage() {
  //   history.push('/help');
  // }
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
          <div className="logo">
            <Title style={{ color: 'white', textAlign: 'center' }} level={3}>
              {collapsed ? '🍲' : '🍲 HuoguoML'}
            </Title>
          </div>
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
                  onClick={() => toExperimentPageWithName(experiment.name)}
                  key={`experiments_${experiment.id}`}
                >
                  {experiment.name}
                </Menu.Item>
              ))}
            </SubMenu>
            <Menu.Item
              key="models"
              icon={<DatabaseOutlined />}
              onClick={toModelPage}
            >
              Models
            </Menu.Item>
            <Menu.Item
              key="services"
              icon={<DesktopOutlined />}
              onClick={toServicesPage}
            >
              Services
            </Menu.Item>
            {/*            <Menu.Item
              onClick={toHelpPage}
              key="help"
              icon={<QuestionOutlined />}
            >
              Help
            </Menu.Item>*/}
          </Menu>
        </Sider>
        <Layout
          className="site-layout"
          style={collapsed ? { marginLeft: 80 } : { marginLeft: 200 }}
        >
          <Header className="site-layout-background" />
          <Content>
            <Switch>
              <Route exact path="/" component={HelpPage} />
              <Route
                exact
                path="/experiments/:experimentName"
                component={ExperimentPage}
              />
              <Route
                path="/experiments/:experimentName/compare"
                component={CompareRunPage}
              />
              <Route
                exact
                path="/experiments/:experimentName/:runId"
                component={ExperimentRunPage}
              />
              <Route exact path="/models" component={ModelPage} />
              <Route
                exact
                path="/models/:mlModelName"
                component={ModelDetailPage}
              />
              <Route exact path="/services" component={ServicesPage} />
              {/*<Route exact path="/help" component={HelpPage} />*/}
              <Route component={NotFoundPage} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            HuoguoML - Made by Data Scientist for Data Scientist
          </Footer>
        </Layout>
      </Layout>
    </>
  );
});
