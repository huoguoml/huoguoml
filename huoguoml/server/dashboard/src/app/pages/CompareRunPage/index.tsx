import * as React from 'react';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useCompareRunPageSlice } from './slice';
import { selectCompareRunPage } from './slice/selectors';
import { ParameterTable } from '../../components/ParameterTable/Loadable';

export function CompareRunPage() {
  const { experimentName } = useParams<Record<string, string>>();
  const { search } = useLocation();
  const dispatch = useDispatch();
  const { actions } = useCompareRunPageSlice();
  const compareRunPageState = useSelector(selectCompareRunPage);

  React.useEffect(() => {
    dispatch(
      actions.getCompareRunState(`${search}&experiment_name=${experimentName}`),
    );
  }, [dispatch, experimentName, actions, search]);

  return (
    <>
      <ContentCardLayout
        contentUri={['experiments', experimentName, `compare${search}`]}
      >
        <ParameterTable
          runs={compareRunPageState.runs}
          parameter_key={'metrics'}
        />
        <h1>hi</h1>
        <h1>hi</h1>
        <h1>hi</h1>
        <h1>hi</h1>
      </ContentCardLayout>
    </>
  );
}
