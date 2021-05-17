import * as React from 'react';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useCompareRunPageSlice } from './slice';
import { selectCompareRunPage } from './slice/selectors';
import { ParameterTable } from '../../components/Table/ParameterTable/Loadable';
import { Typography } from 'antd';

export function CompareRunPage() {
  const { Title } = Typography;

  const { experimentName } = useParams<Record<string, string>>();
  const { search } = useLocation();
  const dispatch = useDispatch();
  const { actions } = useCompareRunPageSlice();
  const compareRunPageState = useSelector(selectCompareRunPage);

  React.useEffect(() => {
    dispatch(
      actions.getCompareRunState(`${search}&experiment_name=${experimentName}`),
    );
  }, [dispatch, experimentName, actions, search]);

  return (
    <>
      <ContentCardLayout
        contentUri={['experiments', experimentName, `compare${search}`]}
      >
        <Title level={4}>
          Comparing {compareRunPageState.runs.length} runs
        </Title>

        <>
          <Title level={3}>Metrics</Title>
          <ParameterTable
            runs={compareRunPageState.runs}
            parameter_key={'metrics'}
          />
        </>

        <>
          <Title level={3}>Parameters</Title>
          <ParameterTable
            runs={compareRunPageState.runs}
            parameter_key={'parameters'}
          />
        </>
        <>
          <Title level={3}>Tags</Title>
          <ParameterTable
            runs={compareRunPageState.runs}
            parameter_key={'tags'}
          />
        </>
      </ContentCardLayout>
    </>
  );
}
