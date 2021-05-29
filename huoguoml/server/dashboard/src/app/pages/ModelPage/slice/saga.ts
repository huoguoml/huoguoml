import { put, takeLatest } from 'redux-saga/effects';
import { modelPageActions as actions } from '.';
import axios from 'axios';
import { ML_MODEL_URI } from '../../../../constants';
import { PayloadAction } from '@reduxjs/toolkit';

function* getModelState(action: PayloadAction<string>) {
  try {
    const mlModelsResponse = yield axios.get(ML_MODEL_URI);
    yield put(
      actions.getModelStateSuccess({
        ml_registry: mlModelsResponse.data,
      }),
    );
  } catch (error) {
    yield put(actions.getModelStateFailure(error.toLocaleString()));
  }
}

export function* modelPageSaga() {
  yield takeLatest(actions.getModelState.type, getModelState);
}
