import { put, takeLatest } from 'redux-saga/effects';
import { modelComparePageActions as actions } from '.';
import axios from 'axios';
import { ML_MODEL_URI, RUN_URI } from '../../../../constants';
import { PayloadAction } from '@reduxjs/toolkit';
import { MLModelInterface, RunInterface } from '../../../../types';

function* getBaseModelState(action: PayloadAction<string>) {
  try {
    const mlModelResponse = yield axios.get(
      `${ML_MODEL_URI}/${action.payload}`,
    );
    const ml_model: MLModelInterface = mlModelResponse.data;
    const runResponse = yield axios.get(`${RUN_URI}/${ml_model.run_id}`);
    const run: RunInterface = runResponse.data;
    yield put(
      actions.getBaseModelStateSuccess({
        base: ml_model,
        base_run: run,
      }),
    );
  } catch (error) {
    yield put(actions.getBaseModelStateFailure(error.toLocaleString()));
  }
}

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

export function* modelComparePageSaga() {
  yield takeLatest(actions.getBaseModelState.type, getBaseModelState);
  yield takeLatest(actions.getModelsState.type, getModelsState);
}
