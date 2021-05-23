import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModelDetailPageSlice } from './slice';
import { selectModelDetailPageState } from './slice/selectors';
import { useParams } from 'react-router-dom';
import { RecordTags } from '../../components/RecordTags/Loadable';
import { StatusTag } from '../../components/StatusTag/Loadable';
import { RegisterModelButton } from '../../components/Button/RegisterModelButton/Loadable';
import { Button, Typography } from 'antd';
import { RecordTable } from '../../components/Table/RecordTable/Loadable';
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
      <ContentCardLayout contentUri={['ml_models', mlModelName]} skip={-1}>
        <Title level={4}>Model: {mlModelName}</Title>
        <Title level={4}>Run</Title>
        <Title level={4}>Run</Title>
      </ContentCardLayout>
    </>
  );
}
