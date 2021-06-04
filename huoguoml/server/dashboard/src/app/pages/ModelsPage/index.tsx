import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModelsPageSlice } from './slice';
import { selectModelsPageState } from './slice/selectors';
import { useHistory, useParams } from 'react-router-dom';
import { Typography } from 'antd';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { ModelsTable } from '../../components/tables/ModelsTage/Loadable';

export function ModelsPage() {
  const { mlModelName } = useParams<Record<string, string>>();

  const dispatch = useDispatch();
  const { actions } = useModelsPageSlice();
  const modelsPageState = useSelector(selectModelsPageState);

  React.useEffect(() => {
    dispatch(actions.getModelsState(`${mlModelName}`));
  }, [dispatch, mlModelName, actions]);
  const { Title } = Typography;

  let history = useHistory();
  function toModelPage(mlModelVersion: string) {
    history.push(`/models/${mlModelName}/${mlModelVersion}`);
  }

  return (
    <>
      <ContentCardLayout contentUri={['models', mlModelName]} skip={-1}>
        <Title level={2}>Model: {mlModelName}</Title>
        <ModelsTable models={modelsPageState.ml_models} onClick={toModelPage} />
      </ContentCardLayout>
    </>
  );
}
