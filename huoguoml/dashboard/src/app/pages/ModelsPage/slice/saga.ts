import { put, takeLatest } from 'redux-saga/effects';
import { modelsPageActions as actions } from '.';
import axios from 'axios';
import { ML_MODEL_URI } from '../../../../constants';
import { PayloadAction } from '@reduxjs/toolkit';

function* getModelsState(action: PayloadAction<string>) {
  try {
    const mlModelResponse = yield axios.get(
      `${ML_MODEL_URI}/${action.payload}`,
    );
    yield put(
      actions.getModelsStateSuccess({
        ml_models: mlModelResponse.data,
      }),
    );
  } catch (error) {
    yield put(actions.getModelsStateFailure(error.toLocaleString()));
  }
}

export function* modelsPageSaga() {
  yield takeLatest(actions.getModelsState.type, getModelsState);
}
