import { put, takeLatest } from 'redux-saga/effects';
import { modelsPageActions as actions } from '.';
import axios from 'axios';
import { SERVICE_URI } from '../../../../constants';

function* getModelsState() {
  try {
    const servicesResponse = yield axios.get(`${SERVICE_URI}`);
    const services = servicesResponse.data;
    services.sort((a, b) => b.id - a.id);

    yield put(
      actions.getModelsState(),
    );
  } catch (error) {
    yield put(actions.getModelsStateFailure(error.toLocaleString()));
  }
}

export function* modelsPageSaga() {
  yield takeLatest(actions.getModelsState.type, getModelsState);
}
