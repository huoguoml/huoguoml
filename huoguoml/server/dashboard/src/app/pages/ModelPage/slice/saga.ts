import { put, takeLatest } from 'redux-saga/effects';
import { modelPageActions as actions } from '.';
import axios from 'axios';
import { ML_MODEL_URI, RUN_URI } from '../../../../constants';
import { PayloadAction } from '@reduxjs/toolkit';
import { MLModelInterface, RunInterface } from '../../../../types';

function* getModelState(action: PayloadAction<string>) {
  try {
    const mlModelResponse = yield axios.get(
      `${ML_MODEL_URI}/${action.payload}`,
    );
    const ml_model: MLModelInterface = mlModelResponse.data;
    const runResponse = yield axios.get(`${RUN_URI}/${ml_model.run_id}`);
    const run: RunInterface = runResponse.data;
    yield put(
      actions.getModelStateSuccess({
        ml_model: ml_model,
        run: run,
      }),
    );
  } catch (error) {
    yield put(actions.getModelStateFailure(error.toLocaleString()));
  }
}

export function* modelPageSaga() {
  yield takeLatest(actions.getModelState.type, getModelState);
}
