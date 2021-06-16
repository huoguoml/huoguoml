import * as React from 'react';
import { Layout, Menu } from 'antd';
import {
  DatabaseOutlined,
  DesktopOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useAppLayoutSlice } from './slice';
import { selectAppLayout } from './slice/selectors';
import { Route, Switch, useHistory } from 'react-router-dom';
import { ExperimentPage } from '../../pages/ExperimentPage/Loadable';
import { NotFoundPage } from '../../components/NotFoundPage/Loadable';
import { ExperimentRunPage } from '../../pages/ExperimentRunPage/Loadable';
import { ServicesPage } from '../../pages/ServicesPage/Loadable';
import { HelpPage } from '../../pages/HelpPage/Loadable';
import { ModelRegistryPage } from '../../pages/ModelRegistryPage/Loadable';
import { ExperimentRunComparePage } from '../../pages/ExperimentRunComparePage/Loadable';
import { ModelsPage } from '../../pages/ModelsPage/Loadable';
import { ModelPage } from '../../pages/ModelPage/Loadable';
import { ModelComparePage } from '../../pages/ModelComparePage/Loadable';

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

  function toExperimentPageWithName(experimentName?: string) {
    history.push(`/experiments/${experimentName}`);
  }

  function toModelPage() {
    history.push(`/models`);
  }

  function toServicesPage() {
    history.push('/services');
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
          <a onClick={toDashboardPage}>
            <p className={'logo'}>{collapsed ? '🍲' : '🍲 HuoguoML'}</p>
          </a>
          <Menu theme="dark" mode="inline">
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
                exact
                path="/experiments/:experimentName/:runNr"
                component={ExperimentRunPage}
              />
              <Route
                exact
                path="/experiments/:experimentName/compare/:runNrs"
                component={ExperimentRunComparePage}
              />
              <Route exact path="/models" component={ModelRegistryPage} />
              <Route
                exact
                path="/models/:mlModelName/compare/:baseModel...:compareModel"
                component={ModelComparePage}
              />
              <Route exact path="/models/:mlModelName" component={ModelsPage} />
              <Route
                exact
                path="/models/:mlModelName/:mlModelVersion"
                component={ModelPage}
              />
              <Route exact path="/services" component={ServicesPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>©2020 HuoguoML</Footer>
        </Layout>
      </Layout>
    </>
  );
});
