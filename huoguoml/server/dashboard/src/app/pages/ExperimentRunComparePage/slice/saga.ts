import { put, takeLatest } from 'redux-saga/effects';
import { compareRunPageActions as actions } from '.';

import axios from 'axios';
import { RUN_URI } from '../../../../constants';
import { PayloadAction } from '@reduxjs/toolkit';

function* getExperimentRunCompareState(action: PayloadAction<string>) {
  try {
    const runResponse = yield axios.get(`${RUN_URI}${action.payload}`);
    yield put(
      actions.getExperimentRunCompareStateSuccess({
        runs: runResponse.data,
      }),
    );
  } catch (error) {
    yield put(
      actions.getExperimentRunCompareStateFailure(error.toLocaleString()),
    );
  }
}

export function* experimentRunCompareSaga() {
  yield takeLatest(
    actions.getExperimentRunCompareState.type,
    getExperimentRunCompareState,
  );
}
