import * as React from 'react';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { useDispatch, useSelector } from 'react-redux';
import { useModelPageSlice } from './slice';
import { selectModelPageState } from './slice/selectors';
import { Select, Typography } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { ModelRegistryTable } from '../../components/Table/ModelRegistryTable/Loadable';

export function ModelPage() {
  const { mlModelName } = useParams<Record<string, string>>();
  const { Title } = Typography;
  let history = useHistory();

  const dispatch = useDispatch();
  const { actions } = useModelPageSlice();
  const modelPageState = useSelector(selectModelPageState);

  React.useEffect(() => {
    dispatch(actions.getModelState(mlModelName));
  }, [dispatch, actions, mlModelName]);

  function toModelDetailPage(modelName: string) {
    history.push(`/models/${modelName}`);
  }

  return (
    <>
      <ContentCardLayout contentUri={['models']} skip={-1}>
        <Title level={2}>Models</Title>
        <>
          <Title level={3}>Available models</Title>
          <ModelRegistryTable
            models={modelPageState.ml_registry}
            onClick={toModelDetailPage}
          />
        </>
      </ContentCardLayout>
    </>
  );
}
