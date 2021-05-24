import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useExperimentRunPageSlice } from './slice';
import { selectExperimentRunPage } from './slice/selectors';
import { Button, Typography } from 'antd';
import { RecordTable } from '../../components/Table/RecordTable/Loadable';
import { RecordTags } from '../../components/RecordTags/Loadable';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { StatusTag } from '../../components/StatusTag/Loadable';
import { RegisterModelButton } from '../../components/Button/RegisterModelButton/Loadable';

export function ExperimentRunPage() {
  const { runId, experimentName } = useParams<Record<string, string>>();

  const dispatch = useDispatch();
  const { actions } = useExperimentRunPageSlice();
  const experimentRunPageState = useSelector(selectExperimentRunPage);

  React.useEffect(() => {
    dispatch(actions.getExperimentRunState(`/${experimentName}/${runId}`));
  }, [dispatch, runId, actions, experimentName]);

  const { Title, Paragraph } = Typography;
  return (
    <>
      <ContentCardLayout contentUri={['experiments', experimentName, runId]}>
        <>
          <Title level={4}>Run: {runId}</Title>
          <RecordTags record={experimentRunPageState.run.tags} />
          <StatusTag status_code={experimentRunPageState.run.status} />

          <RegisterModelButton run={experimentRunPageState.run} />
          <Button disabled={true}>Compare</Button>
        </>
        <>
          <Title level={5}>Description</Title>
          <Paragraph copyable={true} editable={true}>
            {''}
          </Paragraph>
        </>
        <>
          <Title level={5}>Parameters</Title>
          <RecordTable
            title={'Parameters'}
            record={experimentRunPageState.run.parameters}
          />
        </>
        <>
          <Title level={5}>Metrics</Title>
          <RecordTable
            title={'Metrics'}
            record={experimentRunPageState.run.metrics}
          />
        </>
      </ContentCardLayout>
    </>
  );
}
