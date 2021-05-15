import { put, takeLatest } from 'redux-saga/effects';
import { appLayoutActions as actions } from './index';
import { EXPERIMENT_URI, ML_MODEL_URI } from '../../../../constants';
import axios from 'axios';

function* getLayoutStateExperiments() {
  try {
    const experimentsResponse = yield axios.get(EXPERIMENT_URI);
    yield put(
      actions.getLayoutStateExperimentsSuccess({
        experiments: experimentsResponse.data,
      }),
    );
  } catch (error) {
    yield put(actions.getLayoutStateFailure(error.toLocaleString()));
  }
}

function* getLayoutStateMLModels() {
  try {
    const mlModelsResponse = yield axios.get(ML_MODEL_URI);
    yield put(
      actions.getLayoutStateMLModelsSuccess({
        ml_models: mlModelsResponse.data,
      }),
    );
  } catch (error) {
    yield put(actions.getLayoutStateFailure(error.toLocaleString()));
  }
}

export function* appLayoutSaga() {
  yield takeLatest(actions.getLayoutState.type, getLayoutStateExperiments);
  yield takeLatest(actions.getLayoutState.type, getLayoutStateMLModels);
}
