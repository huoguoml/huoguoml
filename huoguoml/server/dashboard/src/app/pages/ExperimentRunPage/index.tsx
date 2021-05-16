import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useExperimentRunPageSlice } from './slice';
import { selectExperimentRunPage } from './slice/selectors';
import { Typography } from 'antd';
import { RecordTable } from '../../components/RecordTable/Loadable';
import { RecordTags } from '../../components/RecordTags/Loadable';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { StatusTag } from '../../components/StatusTag/Loadable';
import { RegisterModelButton } from '../../components/RegisterModelButton/Loadable';

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
          {/*<RecordTags record={experimentRunPageState.run.tags} />*/}
          {/*<StatusTag status_code={experimentRunPageState.run.status} />*/}
          {/*<Paragraph copyable={true} editable={true}>*/}
          {/*  {''}*/}
          {/*</Paragraph>*/}
          {/*<RegisterModelButton*/}
          {/*  run={experimentRunPageState.run}*/}
          {/*  disabled={!experimentRunPageState.run.model_definition}*/}
          {/*/>*/}
        </>
        <Title level={4}>Run: {runId}</Title>
        <Title level={4}>Run: {runId}</Title>

        {/*<RecordTable*/}
        {/*  title={'Parameters'}*/}
        {/*  record={experimentRunPageState.run.parameters}*/}
        {/*/>*/}
        {/*<RecordTable*/}
        {/*  title={'Metrics'}*/}
        {/*  record={experimentRunPageState.run.metrics}*/}
        {/*/>*/}
      </ContentCardLayout>
    </>
  );
}
