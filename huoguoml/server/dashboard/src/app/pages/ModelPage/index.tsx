import * as React from 'react';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { useDispatch, useSelector } from 'react-redux';
import { useModelPageSlice } from './slice';
import { selectModelPageState } from './slice/selectors';
import { Typography } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { ModelTable } from '../../components/Table/ModelTable/Loadable';

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
      <ContentCardLayout contentUri={['models', mlModelName]}>
        <Title level={4}>Models</Title>
        <ModelTable
          models={modelPageState.models}
          onClick={toModelDetailPage}
        />
      </ContentCardLayout>
    </>
  );
}
