import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectExperimentPage } from './slice/selectors';
import { useExperimentPageSlice } from './slice';
import { RunTable } from '../../components/RunTable/Loadable';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { RunInterface } from '../../../types';
import { Typography } from 'antd';

export function ExperimentPage() {
  const { Title, Paragraph } = Typography;

  const { experimentName } = useParams<Record<string, string>>();

  const dispatch = useDispatch();
  const { actions } = useExperimentPageSlice();

  const experimentPageState = useSelector(selectExperimentPage);

  React.useEffect(() => {
    dispatch(actions.getExperimentState(experimentName));
  }, [dispatch, experimentName, actions]);

  let history = useHistory();

  function toRunPage(runId: number) {
    history.push(`/experiments/${experimentName}/${runId}`);
  }

  React.useEffect(() => {
    if (experimentPageState.experiment?.runs) {
      setSelectedRows(experimentPageState.experiment.runs.slice(0, 5));
    }
  }, [dispatch, experimentPageState.experiment]);

  const [selectedRows, setSelectedRows] = React.useState<RunInterface[]>([]);
  return (
    <>
      <ContentCardLayout contentUri={['experiments', experimentName]}>
        <>
          <Title level={4}>Experiment: {experimentName}</Title>
          <Paragraph copyable={true} editable={true}>
            {experimentPageState.experiment?.description
              ? experimentPageState.experiment?.description
              : ''}
          </Paragraph>
        </>

        {/*{selectedRows.length > 0 && <RunMetricCharts runs={selectedRows} />}*/}

        {experimentPageState.experiment?.runs && (
          <RunTable
            runs={[...experimentPageState.experiment.runs]}
            defaultRuns={selectedRows}
            setSelectedRows={setSelectedRows}
            onClick={toRunPage}
          />
        )}
      </ContentCardLayout>
    </>
  );
}
