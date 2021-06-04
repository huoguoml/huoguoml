import { put, takeLatest } from 'redux-saga/effects';
import { modelRegistryPageActions as actions } from '.';
import axios from 'axios';
import { ML_MODEL_URI } from '../../../../constants';
import { PayloadAction } from '@reduxjs/toolkit';

function* getModelRegistryState(action: PayloadAction<string>) {
  try {
    const mlModelsResponse = yield axios.get(ML_MODEL_URI);
    yield put(
      actions.getModelRegistryStateSuccess({
        ml_registry: mlModelsResponse.data,
      }),
    );
  } catch (error) {
    yield put(actions.getModelRegistryStateFailure(error.toLocaleString()));
  }
}

export function* modelRegistryPageSaga() {
  yield takeLatest(actions.getModelRegistryState.type, getModelRegistryState);
}
