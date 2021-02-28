import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from 'antd';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectAppLayout } from '../../layout/slice/selectors';
import { selectExperimentPage } from './slice/selectors';
import { useExperimentPageSlice } from './slice';
import { RunTable } from '../../components/RunTable/Loadable';

export function ExperimentPage() {
  const { experimentId } = useParams<Record<string, string | undefined>>();

  const dispatch = useDispatch();
  const { actions } = useExperimentPageSlice();

  const appLayoutState = useSelector(selectAppLayout);
  const experimentPageState = useSelector(selectExperimentPage);

  React.useEffect(() => {
    if (experimentId) {
      dispatch(actions.getExperimentState(Number(experimentId)));
    }
  }, [dispatch, experimentId]);

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <Card style={{ width: '100%' }}>
        <p>Experiments</p>
      </Card>
      {experimentId ? (
        <RunTable runs={experimentPageState.experiment?.runs} />
      ) : (
        <RunTable
          runs={appLayoutState.experiments?.flatMap(
            experiment => experiment.runs,
          )}
          useId={true}
        />
      )}
    </>
  );
}
