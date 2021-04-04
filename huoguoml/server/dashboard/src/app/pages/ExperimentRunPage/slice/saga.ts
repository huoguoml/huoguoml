import { put, takeLatest } from 'redux-saga/effects';
import { runPageActions as actions } from '.';
import axios from 'axios';
import { EXPERIMENT_URI } from '../../../../constants';
import { PayloadAction } from '@reduxjs/toolkit';

function* getExperimentRunState(action: PayloadAction<string>) {
  try {
    const experimentResponse = yield axios.get(
      `${EXPERIMENT_URI}${action.payload}`,
    );
    yield put(
      actions.getExperimentRunStateSuccess({
        run: experimentResponse.data,
      }),
    );
  } catch (error) {
    yield put(actions.getExperimentRunStateSuccess(error.toLocaleString()));
  }
}

export function* experimentRunPageSaga() {
  yield takeLatest(actions.getExperimentRunState.type, getExperimentRunState);
}
