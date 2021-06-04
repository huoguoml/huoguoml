import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModelPageSlice } from './slice';
import { selectModelPageState } from './slice/selectors';
import { useParams } from 'react-router-dom';
import { Typography } from 'antd';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';

export function ModelPage() {
  const { mlModelName, mlModelVersion } = useParams<Record<string, string>>();

  const dispatch = useDispatch();
  const { actions } = useModelPageSlice();
  const modelPageState = useSelector(selectModelPageState);

  React.useEffect(() => {
    dispatch(actions.getModelState(`${mlModelName}/${mlModelVersion}`));
  }, [dispatch, mlModelName, mlModelVersion, actions]);
  const { Title } = Typography;

  return (
    <>
      <ContentCardLayout
        contentUri={['models', mlModelName, mlModelVersion]}
        skip={-1}
      >
        <Title level={2}>{`Model ${mlModelName}, ${mlModelVersion}`}</Title>
        {modelPageState.run?.experiment_name}
        {modelPageState.run?.run_nr}
      </ContentCardLayout>
    </>
  );
}
