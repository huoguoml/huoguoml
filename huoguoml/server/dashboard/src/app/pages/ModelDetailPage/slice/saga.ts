import { put, takeLatest } from 'redux-saga/effects';
import { modelDetailPageActions as actions } from '.';
import axios from 'axios';
import { ML_MODEL_URI } from '../../../../constants';
import { PayloadAction } from '@reduxjs/toolkit';

function* getModelDetailState(action: PayloadAction<string>) {
  try {
    const mlModelResponse = yield axios.get(
      `${ML_MODEL_URI}/${action.payload}`,
    );
    yield put(
      actions.getModelDetailStateSuccess({
        ml_models: mlModelResponse.data,
      }),
    );
  } catch (error) {
    yield put(actions.getModelDetailStateFailure(error.toLocaleString()));
  }
}

export function* modelDetailPageSaga() {
  yield takeLatest(actions.getModelDetailState.type, getModelDetailState);
}
