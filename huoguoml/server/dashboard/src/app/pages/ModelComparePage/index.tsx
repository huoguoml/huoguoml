import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModelComparePageSlice } from './slice';
import { selectModelComparePageState } from './slice/selectors';
import { useParams } from 'react-router-dom';
import { Alert, Button, message, Select, Space, Typography } from 'antd';
import { ContentCardsLayout } from '../../layout/ContentCardsLayout/Loadable';
import { ArrowRightOutlined } from '@ant-design/icons';
import { modelTagToNumber, modelTagToString } from '../../../utils';
import { useHistory } from 'react-router';
import axios from 'axios';
import { ML_MODEL_URI } from '../../../constants';

export function ModelComparePage() {
  const { Option } = Select;
  const { Title } = Typography;

  const { mlModelName, baseModelVersion, baseModelStage } = useParams<
    Record<string, string>
  >();

  const dispatch = useDispatch();
  const { actions } = useModelComparePageSlice();
  const modelComparePageState = useSelector(selectModelComparePageState);

  React.useEffect(() => {
    dispatch(actions.getModelsState(`${mlModelName}`));
    dispatch(actions.getBaseModelState(`${mlModelName}/${baseModelVersion}`));
  }, [dispatch, mlModelName, baseModelVersion, actions]);

  let history = useHistory();
  function toModelComparePage(modelVersion, modelStage) {
    history.push(
      `/models/${mlModelName}/compare/${modelVersion}...${modelStage}`,
    );
  }

  function updateModelState(tag: number) {
    axios
      .put(`${ML_MODEL_URI}/${mlModelName}/${baseModelVersion}`, {
        ...modelComparePageState.base,
        tag: tag,
      })
      .then(response => {
        message.success(`Updated model state`);
        history.push(`/models/${mlModelName}`);
      })
      .catch(error => {
        message.error(error.message);
      });
  }

  return (
    <>
      <ContentCardsLayout
        contentUri={[
          'models',
          mlModelName,
          'compare',
          `${baseModelVersion}...${baseModelStage}`,
        ]}
        skipUri={['compare']}
      >
        <Title level={1}>Change stage</Title>

        <>
          <Title level={2}>Select stage</Title>

          {baseModelStage !==
            modelTagToString(modelComparePageState.base?.tag) && (
            <Alert
              style={{ marginBottom: 12 }}
              showIcon
              message={`Change stage of model ${mlModelName} ${baseModelVersion} to ${baseModelStage}`}
              type="info"
              action={
                <>
                  <Button
                    type={'primary'}
                    onClick={() =>
                      updateModelState(modelTagToNumber(baseModelStage))
                    }
                  >
                    Change stage
                  </Button>
                </>
              }
            />
          )}
          <Space>
            <Select
              defaultValue={baseModelVersion}
              style={{ width: 120 }}
              onSelect={value => toModelComparePage(value, baseModelStage)}
            >
              {modelComparePageState.ml_models?.map(ml_model => (
                <Option value={ml_model.version}>{ml_model.version}</Option>
              ))}
            </Select>
            <ArrowRightOutlined />
            <Select
              defaultValue={baseModelStage}
              style={{ width: 120 }}
              onSelect={value => toModelComparePage(baseModelVersion, value)}
            >
              <Option value="none">None</Option>
              <Option value="staging">Staging</Option>
              <Option value="production">Production</Option>
            </Select>
          </Space>
        </>
      </ContentCardsLayout>
    </>
  );
}
