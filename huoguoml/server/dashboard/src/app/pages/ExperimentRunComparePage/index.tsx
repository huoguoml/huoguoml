import * as React from 'react';
import { ContentCardsLayout } from '../../layout/ContentCardsLayout/Loadable';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useExperimentRunComparePageSlice } from './slice';
import { selectExperimentRunCompareState } from './slice/selectors';
import { ParameterTable } from '../../components/tables/ParameterTable/Loadable';
import { Typography } from 'antd';
import { RunMetricCharts } from '../../components/RunMetricCharts/Loadable';

export function ExperimentRunComparePage() {
  const { Title } = Typography;

  const { experimentName, runNrs } = useParams<Record<string, string>>();
  const { search } = useLocation();
  const dispatch = useDispatch();
  const { actions } = useExperimentRunComparePageSlice();
  const compareRunPageState = useSelector(selectExperimentRunCompareState);

  React.useEffect(() => {
    dispatch(
      actions.getExperimentRunCompareState(
        `?run_nrs=${runNrs}&experiment_name=${experimentName}`,
      ),
    );
  }, [dispatch, experimentName, actions, search]);

  return (
    <>
      <ContentCardsLayout
        contentUri={['experiments', experimentName, `compare`, runNrs]}
        skipUri={['compare']}
      >
        <Title level={1}>
          Comparing {compareRunPageState.runs.length} runs
        </Title>

        <RunMetricCharts runs={compareRunPageState.runs} />
        <>
          <Title level={2}>Metrics</Title>
          <ParameterTable
            runs={compareRunPageState.runs}
            parameter_key={'metrics'}
          />
        </>

        <>
          <Title level={2}>Parameters</Title>
          <ParameterTable
            runs={compareRunPageState.runs}
            parameter_key={'parameters'}
          />
        </>
        <>
          <Title level={2}>Tags</Title>
          <ParameterTable
            runs={compareRunPageState.runs}
            parameter_key={'tags'}
          />
        </>
      </ContentCardsLayout>
    </>
  );
}
