import * as React from 'react';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { useDispatch, useSelector } from 'react-redux';
import { useModelsPageSlice } from './slice';
import { selectModelsPageState } from './slice/selectors';
import { Typography } from 'antd';

export function ModelsPage() {
  const dispatch = useDispatch();
  const { actions } = useModelsPageSlice();
  const modelsPageState = useSelector(selectModelsPageState);

  React.useEffect(() => {
    dispatch(actions.getModelsState());
  }, [dispatch]);

  const { Title } = Typography;

  return (
    <>
      <ContentCardLayout contentUri={['models']}>
        <Title level={4}>Models</Title>
        <Title level={4}>Models</Title>
      </ContentCardLayout>
    </>
  );
}
