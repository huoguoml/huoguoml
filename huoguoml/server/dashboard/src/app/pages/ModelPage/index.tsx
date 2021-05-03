import * as React from 'react';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { useDispatch, useSelector } from 'react-redux';
import { useModelPageSlice } from './slice';
import { selectModelPageState } from './slice/selectors';
import { Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { RunTable } from '../../components/RunTable/Loadable';

export function ModelPage() {
  const { mlModelName } = useParams<Record<string, string>>();

  const dispatch = useDispatch();
  const { actions } = useModelPageSlice();
  const modelPageState = useSelector(selectModelPageState);

  React.useEffect(() => {
    dispatch(actions.getModelState(mlModelName));
  }, [dispatch, actions, mlModelName]);

  const { Title } = Typography;

  function toRunPage(runId: number) {}

  return (
    <>
      <ContentCardLayout contentUri={['models', mlModelName]}>
        <Title level={4}>Models</Title>
        <RunTable runs={modelPageState.model.runs} onClick={toRunPage} />
      </ContentCardLayout>
    </>
  );
}
