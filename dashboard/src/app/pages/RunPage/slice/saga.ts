import { put, takeLatest } from 'redux-saga/effects';
import { runPageActions as actions } from '.';
import axios from 'axios';
import { RUN_URI } from '../../../../constants';
import { PayloadAction } from '@reduxjs/toolkit';

function* getRunState(action: PayloadAction<string>) {
  try {
    const experimentResponse = yield axios.get(`${RUN_URI}/${action.payload}`);
    yield put(
      actions.getRunStateSuccess({
        run: experimentResponse.data,
      }),
    );
  } catch (error) {
    yield put(actions.getRunStateFailure(error.toLocaleString()));
  }
}

export function* runPageSaga() {
  yield takeLatest(actions.getRunState.type, getRunState);
}
