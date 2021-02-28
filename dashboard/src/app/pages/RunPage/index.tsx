import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRunPageSlice } from './slice';
import { selectRunPage } from './slice/selectors';
import { Card, Typography } from 'antd';

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

      <Card style={{ width: '100%' }}>
        <Paragraph>
          {runPageState.run?.model_definition?.requirements}
          {runPageState.run?.model_definition?.model_api.arguments.string}
          {runPageState.run?.model_definition?.requirements}
        </Paragraph>
      </Card>
    </>
  );
}
