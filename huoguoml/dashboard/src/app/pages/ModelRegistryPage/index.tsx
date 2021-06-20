import * as React from 'react';
import { ContentCardsLayout } from '../../layout/ContentCardsLayout/Loadable';
import { useDispatch, useSelector } from 'react-redux';
import { useModelRegistryPageSlice } from './slice';
import { selectModelPageState } from './slice/selectors';
import { Typography } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { ModelRegistryTable } from '../../components/tables/ModelRegistryTable/Loadable';

export function ModelRegistryPage() {
  const { mlModelName } = useParams<Record<string, string>>();
  const { Title } = Typography;
  let history = useHistory();

  const dispatch = useDispatch();
  const { actions } = useModelRegistryPageSlice();
  const modelPageState = useSelector(selectModelPageState);

  React.useEffect(() => {
    dispatch(actions.getModelRegistryState(mlModelName));
  }, [dispatch, actions, mlModelName]);

  function toModelPage(modelUri: string) {
    history.push(`/models/${modelUri}`);
  }
  return (
    <>
      <ContentCardsLayout contentUri={['models']}>
        <Title level={1}>Models</Title>
        <>
          <Title level={2}>Available models</Title>
          <ModelRegistryTable
            registry={modelPageState.ml_registry}
            onClick={toModelPage}
          />
        </>
      </ContentCardsLayout>
    </>
  );
}
