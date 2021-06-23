import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useExperimentRunPageSlice } from './slice';
import { selectExperimentRunPage } from './slice/selectors';
import { Col, Descriptions, message, Row, Space, Typography } from 'antd';
import { RecordTable } from '../../components/tables/RecordTable/Loadable';
import { ContentCardsLayout } from '../../layout/ContentCardsLayout/Loadable';
import { StatusTag } from '../../components/StatusTag/Loadable';
import { RegisterModelButton } from '../../components/buttons/RegisterModelButton/Loadable';
import { MarkdownEditor } from '../../components/MarkdownEditor/Loadable';
import { secondsToTime, timestampToDate } from '../../../utils/time';
import { NotFoundPage } from '../../components/NotFoundPage/Loadable';
import axios from 'axios';
import { RUN_URI } from '../../../constants';
import { MarkdownPreview } from '../../components/MarkdownPreview/Loadable';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import 'katex/dist/katex.min.css';

export function ExperimentRunPage() {
  const { Title } = Typography;

  const { runNr, experimentName } = useParams<Record<string, string>>();

  const dispatch = useDispatch();
  const { actions } = useExperimentRunPageSlice();
  const experimentRunPageState = useSelector(selectExperimentRunPage);

  React.useEffect(() => {
    dispatch(actions.getExperimentRunState(`/${experimentName}/${runNr}`));
  }, [dispatch, runNr, actions, experimentName]);

  function updateDescription(description: string) {
    if (experimentRunPageState.run) {
      axios
        .put(`${RUN_URI}/${experimentRunPageState.run.id}`, {
          ...experimentRunPageState.run,
          description: description,
        })
        .then(response => {
          message.success(`Updated description`);
        })
        .catch(error => {
          message.error(error.message);
        });
    }
  }

  return (
    <>
      {experimentRunPageState.run ? (
        <ContentCardsLayout
          contentUri={['experiments', experimentName, runNr]}
          skipUri={['experiments']}
        >
          <>
            <Row justify={'space-between'} align={'top'}>
              <Col>
                <Space align={'start'}>
                  <Title level={1}>Run: {runNr}</Title>
                  <StatusTag status_code={experimentRunPageState.run.status} />
                </Space>
              </Col>
              <Col>
                <RegisterModelButton
                  run={experimentRunPageState.run}
                  onClick={() =>
                    dispatch(
                      actions.getExperimentRunState(
                        `/${experimentName}/${runNr}`,
                      ),
                    )
                  }
                />
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
                label="Last modification at"
                labelStyle={{ fontWeight: 'bold' }}
              >
                {timestampToDate(experimentRunPageState.run.last_modification)}
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
          <MarkdownEditor
            value={experimentRunPageState.run.description}
            placeholder={
              'Add a description to your experiment in markdown format'
            }
            onSubmit={updateDescription}
          />
          <>
            <Title level={2}>Metrics</Title>
            <RecordTable
              title={'Metrics'}
              record={experimentRunPageState.run.metrics}
            />
          </>
          <>
            <Title level={2}>Parameters</Title>
            <RecordTable
              title={'Parameters'}
              record={experimentRunPageState.run.parameters}
            />
          </>
          <>
            <Title level={2}>Tags</Title>
            <RecordTable
              title={'Tags'}
              record={experimentRunPageState.run.tags}
            />
          </>
          <>
            <Title level={2}>Requirements</Title>
            <SyntaxHighlighter
              style={github}
              language={'bash'}
              PreTag="div"
              children={experimentRunPageState.run.model_definition?.requirements.join(
                '\n',
              )}
            />
          </>
        </ContentCardsLayout>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}
