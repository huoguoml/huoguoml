import { put, takeLatest } from 'redux-saga/effects';
import { runPageActions as actions } from '.';

import axios from 'axios';
import { RUN_URI } from '../../../../constants';
import { PayloadAction } from '@reduxjs/toolkit';

function* getRunState(action: PayloadAction) {
  try {
    const runResponse = yield axios.get(`${RUN_URI}`);
    yield put(
      actions.getRunStateSuccess({
        runs: runResponse.data,
      }),
    );
  } catch (error) {
    yield put(actions.getRunStateFailure(error.toLocaleString()));
  }
}

export function* runPageSaga() {
  yield takeLatest(actions.getRunState.type, getRunState);
}
