import * as React from 'react';
import { Card, Typography } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectExperimentPage } from './slice/selectors';
import { useExperimentPageSlice } from './slice';
import { RunTable } from '../../components/RunTable/Loadable';

export function ExperimentPage() {
  const { experimentName } = useParams<Record<string, string | undefined>>();

  const dispatch = useDispatch();
  const { actions } = useExperimentPageSlice();

  const experimentPageState = useSelector(selectExperimentPage);

  React.useEffect(() => {
    dispatch(
      actions.getExperimentState(
        experimentName === 'all' || experimentName === undefined
          ? ''
          : experimentName,
      ),
    );
  }, [dispatch, experimentName, actions]);

  const { Title, Paragraph } = Typography;

  let history = useHistory();

  function toRunPage(runId: number) {
    history.push(`/runs/${runId}`);
  }

  return (
    <>
      <Card style={{ width: '100%' }}>
        <Title level={3}>Experiment: {experimentName}</Title>
        <Paragraph>
          In the process of internal desktop applications development, many
          different design specs and implementations would be involved, which
          might cause designers and developers difficulties and duplication and
          reduce the efficiency of development.
        </Paragraph>
      </Card>
      <RunTable
        runs={experimentPageState.experiment?.flatMap(
          experiment => experiment.runs,
        )}
        onClick={toRunPage}
      />
    </>
  );
}
