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
import { MarkdownEditor } from '../../components/MarkdownEditor/Loadable';

export function ExperimentRunPage() {
  const { runId, experimentName } = useParams<Record<string, string>>();

  const dispatch = useDispatch();
  const { actions } = useExperimentRunPageSlice();
  const experimentRunPageState = useSelector(selectExperimentRunPage);

  React.useEffect(() => {
    dispatch(actions.getExperimentRunState(`/${experimentName}/${runId}`));
  }, [dispatch, runId, actions, experimentName]);

  const { Title } = Typography;
  const [description, setDescription] = React.useState<string>('');

  return (
    <>
      <ContentCardLayout contentUri={['experiments', experimentName, runId]}>
        <>
          <Title level={2}>Run: {runId}</Title>
          <RecordTags record={experimentRunPageState.run.tags} />
          <StatusTag status_code={experimentRunPageState.run.status} />

          <RegisterModelButton run={experimentRunPageState.run} />
          <Button disabled={true}>Compare</Button>
        </>
        <>
          <Title level={3}>Description</Title>
          <MarkdownEditor
            value={description}
            onChange={setDescription}
            placeholder={
              'Add a description to your experiment in markdown format'
            }
          />
        </>
        <>
          <Title level={3}>Parameters</Title>
          <RecordTable
            title={'Parameters'}
            record={experimentRunPageState.run.parameters}
          />
        </>
        <>
          <Title level={3}>Metrics</Title>
          <RecordTable
            title={'Metrics'}
            record={experimentRunPageState.run.metrics}
          />
        </>
      </ContentCardLayout>
    </>
  );
}
