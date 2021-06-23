import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModelsPageSlice } from './slice';
import { selectModelsPageState } from './slice/selectors';
import { useHistory, useParams } from 'react-router-dom';
import { Result, Typography } from 'antd';
import { ContentCardsLayout } from '../../layout/ContentCardsLayout/Loadable';
import { ModelsTable } from '../../components/tables/ModelsTable/Loadable';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { Helmet } from 'react-helmet-async';

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
      <Helmet>
        <title>HuoguoML | Models</title>
        <meta name="description" content="Models" />
      </Helmet>

      {modelsPageState.error === undefined && modelsPageState.ml_models ? (
        <ContentCardsLayout contentUri={['models', mlModelName]}>
          <Title level={1}>Model: {mlModelName}</Title>

          <>
            <Title level={2}>Production model</Title>
            <ModelsTable
              models={modelsPageState.ml_models.filter(
                ml_model => ml_model.tag === 1,
              )}
              onClick={toModelPage}
            />
          </>
          <>
            <Title level={2}>Staging models</Title>
            <ModelsTable
              models={modelsPageState.ml_models.filter(
                ml_model => ml_model.tag === 0,
              )}
              onClick={toModelPage}
            />
          </>

          <>
            <Title level={2}>All models</Title>
            <ModelsTable
              models={modelsPageState.ml_models}
              onClick={toModelPage}
            />
          </>
        </ContentCardsLayout>
      ) : (
        <ContentCardLayout contentUri={['models', mlModelName]}>
          <Result status="404" title="404" subTitle={modelsPageState.error} />
        </ContentCardLayout>
      )}
    </>
  );
}
