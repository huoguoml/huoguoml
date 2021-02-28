import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRunPageSlice } from './slice';
import { selectRunPage } from './slice/selectors';
import { Card, Typography } from 'antd';
import { RecordTable } from '../../components/RecordTable/Loadable';

export function RunPage() {
  const { runId } = useParams<Record<string, string>>();

  const dispatch = useDispatch();
  const { actions } = useRunPageSlice();
  const runPageState = useSelector(selectRunPage);

  React.useEffect(() => {
    dispatch(actions.getRunState(runId));
  }, [dispatch, runId, actions]);

  const { Title, Paragraph } = Typography;
  return (
    <>
      <Card style={{ width: '100%' }}>
        <Title level={3}>Experiment: {runPageState.run?.experiment_name}</Title>
        <Paragraph>{runPageState.run?.creation_time}</Paragraph>
      </Card>

      <RecordTable title={'parameters'} record={runPageState.run?.parameters} />
      <RecordTable title={'metrics'} record={runPageState.run?.metrics} />
      <RecordTable title={'tags'} record={runPageState.run?.tags} />
    </>
  );
}
