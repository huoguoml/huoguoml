import { put, takeLatest } from 'redux-saga/effects';
import { experimentPageActions as actions } from '.';

import axios from 'axios';
import { EXPERIMENT_URI } from '../../../../constants';
import { PayloadAction } from '@reduxjs/toolkit';

function* getExperimentState(action: PayloadAction<string>) {
  try {
    const experimentResponse = yield axios.get(
      `${EXPERIMENT_URI}/${action.payload}`,
    );
    const experiment = experimentResponse.data;
    const runs = experimentResponse.data.runs;
    runs.sort((a, b) => b.run_nr - a.run_nr);
    experiment.runs = runs;
    yield put(
      actions.getExperimentStateSuccess({
        experiment: experiment,
      }),
    );
  } catch (error) {
    yield put(actions.getExperimentStateFailure(error.toLocaleString()));
  }
}

export function* experimentPageSaga() {
  yield takeLatest(actions.getExperimentState.type, getExperimentState);
}
