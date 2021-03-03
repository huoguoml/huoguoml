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
    yield put(
      actions.getExperimentStateSuccess({
        experiment: experimentResponse.data,
      }),
    );
  } catch (error) {
    yield put(actions.getExperimentStateFailure(error.toLocaleString()));
  }
}

export function* experimentPageSaga() {
  yield takeLatest(actions.getExperimentState.type, getExperimentState);
}
