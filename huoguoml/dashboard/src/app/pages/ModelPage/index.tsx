import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModelPageSlice } from './slice';
import { selectModelPageState } from './slice/selectors';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Col, Descriptions, Row, Space, Typography } from 'antd';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { NotFoundPage } from '../../components/NotFoundPage/Loadable';
import { timestampToDate } from '../../../utils/time';
import { ModelTag } from '../../components/ModelTag/Loadable';
import { modelTagToString } from '../../../utils';

export function ModelPage() {
  const { Title } = Typography;

  const { mlModelName, mlModelVersion } = useParams<Record<string, string>>();

  const dispatch = useDispatch();
  const { actions } = useModelPageSlice();
  const modelPageState = useSelector(selectModelPageState);

  React.useEffect(() => {
    dispatch(actions.getModelState(`${mlModelName}/${mlModelVersion}`));
  }, [dispatch, mlModelName, mlModelVersion, actions]);

  let history = useHistory();
  function toModelComparePage() {
    history.push(
      `/models/${mlModelName}/compare/${
        modelPageState.ml_model?.version
      }...${modelTagToString(modelPageState.ml_model?.tag)}`,
    );
  }

  function toExperimentRunPage() {
    history.push(
      `/experiments/${modelPageState.run?.experiment_name}/${modelPageState.run?.run_nr}`,
    );
  }

  return (
    <>
      {modelPageState.ml_model || modelPageState.isLoading ? (
        <ContentCardLayout contentUri={['models', mlModelName, mlModelVersion]}>
          <Row justify={'space-between'} align={'top'}>
            <Col>
              <Space align={'start'}>
                <Title level={1}>
                  {`Model ${mlModelName}: ${mlModelVersion}`}
                </Title>
                <ModelTag tag={modelPageState.ml_model?.tag} />
              </Space>
            </Col>
            <Col>
              <Button type={'primary'} onClick={toModelComparePage}>
                Change stage
              </Button>
            </Col>
          </Row>

          <Descriptions>
            <Descriptions.Item
              label="Created at"
              labelStyle={{ fontWeight: 'bold' }}
            >
              {timestampToDate(modelPageState.ml_model?.creation_time)}
            </Descriptions.Item>
            <Descriptions.Item
              label="Last modification at"
              labelStyle={{ fontWeight: 'bold' }}
            >
              {timestampToDate(modelPageState.ml_model?.last_modification)}
            </Descriptions.Item>
            <Descriptions.Item
              label="Source experiment run"
              labelStyle={{ fontWeight: 'bold' }}
            >
              <a onClick={toExperimentRunPage}>
                {`${modelPageState.run?.experiment_name}/${modelPageState.run?.run_nr}`}
              </a>
            </Descriptions.Item>
            <Descriptions.Item
              label="Author"
              labelStyle={{ fontWeight: 'bold' }}
            >
              {modelPageState.run?.author}
            </Descriptions.Item>
          </Descriptions>
        </ContentCardLayout>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}
