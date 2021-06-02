import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useExperimentRunPageSlice } from './slice';
import { selectExperimentRunPage } from './slice/selectors';
import { Col, Descriptions, Row, Space, Typography } from 'antd';
import { RecordTable } from '../../components/tables/RecordTable/Loadable';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { StatusTag } from '../../components/StatusTag/Loadable';
import { RegisterModelButton } from '../../components/buttons/RegisterModelButton/Loadable';
import { MarkdownEditor } from '../../components/MarkdownEditor/Loadable';
import { secondsToTime, timestampToDate } from '../../../utils/time';
import { NotFoundPage } from '../../components/NotFoundPage/Loadable';

export function ExperimentRunPage() {
  const { runNr, experimentName } = useParams<Record<string, string>>();

  const dispatch = useDispatch();
  const { actions } = useExperimentRunPageSlice();
  const experimentRunPageState = useSelector(selectExperimentRunPage);

  React.useEffect(() => {
    dispatch(actions.getExperimentRunState(`/${experimentName}/${runNr}`));
  }, [dispatch, runNr, actions, experimentName]);

  const { Title } = Typography;
  const [description, setDescription] = React.useState<string>('');

  return (
    <>
      {experimentRunPageState.run ? (
        <ContentCardLayout contentUri={['experiments', experimentName, runNr]}>
          <>
            <Row justify={'space-between'} align={'top'}>
              <Col span={16}>
                <Space align={'start'}>
                  <Title level={2}>Run: {runNr}</Title>
                  <StatusTag status_code={experimentRunPageState.run.status} />
                </Space>
              </Col>
              <Col span={4}>
                <Space>
                  <RegisterModelButton run={experimentRunPageState.run} />
                </Space>
              </Col>
            </Row>

            <Descriptions>
              <Descriptions.Item
                label="Created at"
                labelStyle={{ fontWeight: 'bold' }}
              >
                {timestampToDate(experimentRunPageState.run.creation_time)}
              </Descriptions.Item>
              <Descriptions.Item
                label="Finished at"
                labelStyle={{ fontWeight: 'bold' }}
              >
                {timestampToDate(experimentRunPageState.run.finish_time)}
              </Descriptions.Item>
              <Descriptions.Item
                label="Duration"
                labelStyle={{ fontWeight: 'bold' }}
              >
                {secondsToTime(experimentRunPageState.run.duration)}
              </Descriptions.Item>
              <Descriptions.Item
                label="Author"
                labelStyle={{ fontWeight: 'bold' }}
              >
                {experimentRunPageState.run.author}
              </Descriptions.Item>
            </Descriptions>
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
          <>
            <Title level={3}>Tags</Title>
            <RecordTable
              title={'Tags'}
              record={experimentRunPageState.run.tags}
            />
          </>
        </ContentCardLayout>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}
