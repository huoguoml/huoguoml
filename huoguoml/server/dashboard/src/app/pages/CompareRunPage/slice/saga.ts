import { put, takeLatest } from 'redux-saga/effects';
import { compareRunPageActions as actions } from '.';

import axios from 'axios';
import { RUN_URI } from '../../../../constants';
import { PayloadAction } from '@reduxjs/toolkit';

function* getCompareRunState(action: PayloadAction<string>) {
  try {
    const runResponse = yield axios.get(`${RUN_URI}${action.payload}`);
    yield put(
      actions.getCompareRunStateSuccess({
        runs: runResponse.data,
      }),
    );
  } catch (error) {
    yield put(actions.getCompareRunStateFailure(error.toLocaleString()));
  }
}

export function* compareRunPageSaga() {
  yield takeLatest(actions.getCompareRunState.type, getCompareRunState);
}
