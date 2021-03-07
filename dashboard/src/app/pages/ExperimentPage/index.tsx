import * as React from 'react';
import { Typography } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectExperimentPage } from './slice/selectors';
import { useExperimentPageSlice } from './slice';
import { RunTable } from '../../components/RunTable/Loadable';

export function ExperimentPage() {
  const { experimentName } = useParams<Record<string, string>>();

  const dispatch = useDispatch();
  const { actions } = useExperimentPageSlice();

  const experimentPageState = useSelector(selectExperimentPage);

  React.useEffect(() => {
    dispatch(actions.getExperimentState(experimentName));
  }, [dispatch, experimentName, actions]);

  const { Title, Paragraph } = Typography;

  let history = useHistory();

  function toRunPage(runId: number) {
    history.push(`/experiments/${experimentName}/${runId}`);
  }

  return (
    <>
      <Title level={3}>Experiment: {experimentName}</Title>
      <Paragraph editable={true}>
        {experimentPageState.experiment?.description}
      </Paragraph>

      {experimentPageState.experiment?.runs && (
        <RunTable
          runs={[...experimentPageState.experiment.runs]}
          onClick={toRunPage}
        />
      )}
    </>
  );
}
