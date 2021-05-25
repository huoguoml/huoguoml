import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModelDetailPageSlice } from './slice';
import { selectModelDetailPageState } from './slice/selectors';
import { useParams } from 'react-router-dom';
import { Typography } from 'antd';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';

export function ModelDetailPage() {
  const { mlModelName } = useParams<Record<string, string>>();

  const dispatch = useDispatch();
  const { actions } = useModelDetailPageSlice();
  const modelDetailPageState = useSelector(selectModelDetailPageState);

  React.useEffect(() => {
    dispatch(actions.getModelDetailState(`${mlModelName}`));
  }, [dispatch, mlModelName, actions]);
  const { Title } = Typography;

  return (
    <>
      <ContentCardLayout contentUri={['models', mlModelName]} skip={-1}>
        <Title level={2}>Model: {mlModelName}</Title>
        <Title level={3}>Production</Title>
        <Title level={3}>Staging</Title>
        <Title level={3}>Models</Title>
        <Title level={3}>{modelDetailPageState.model.ml_models?.length}</Title>
      </ContentCardLayout>
    </>
  );
}
