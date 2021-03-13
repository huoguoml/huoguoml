import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useExperimentRunPageSlice } from './slice';
import { selectExperimentRunPage } from './slice/selectors';
import { Button, Card, Col, Row, Typography } from 'antd';
import { RecordTable } from '../../components/RecordTable/Loadable';
import { RecordTags } from '../../components/RecordTags/Loadable';
import { ExperimentContentLayout } from '../../layout/ExperimentContentLayout/Loadable';

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
      <ExperimentContentLayout
        contentUri={['experiments', experimentName, runId]}
      >
        <>
          <Title level={4}>Run: {runId}</Title>
          <RecordTags
            title={'Tags'}
            record={experimentRunPageState.run?.tags}
          />

          <Paragraph copyable={true} editable={true}>
            {''}
          </Paragraph>
        </>
        <RecordTable
          title={'Parameters'}
          record={experimentRunPageState.run?.parameters}
        />
        <RecordTable
          title={'Metrics'}
          record={experimentRunPageState.run?.metrics}
        />
      </ExperimentContentLayout>
    </>
  );
}
