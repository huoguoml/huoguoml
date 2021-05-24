import * as React from 'react';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { useDispatch, useSelector } from 'react-redux';
import { useModelPageSlice } from './slice';
import { selectModelPageState } from './slice/selectors';
import { Select, Typography } from 'antd';
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
    history.push(`/ml_models/${modelName}`);
  }

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  return (
    <>
      <ContentCardLayout contentUri={['ml_models']} skip={-1}>
        <Title level={2}>Models</Title>
        <>
          <Title level={3}>Filter models</Title>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            onChange={handleChange}
            tokenSeparators={[',']}
            placeholder={
              'Search runs by their value by typing the value or specifying a range'
            }
          />
        </>
        <>
          <Title level={3}>Available models</Title>
          <ModelTable
            models={modelPageState.models}
            onClick={toModelDetailPage}
          />
        </>
      </ContentCardLayout>
    </>
  );
}
