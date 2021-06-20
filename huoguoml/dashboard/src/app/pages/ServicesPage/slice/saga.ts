import { put, takeLatest } from 'redux-saga/effects';
import { runPageActions as actions } from '.';
import axios from 'axios';
import { ML_SERVICE_URI } from '../../../../constants';

function* getServiceState() {
  try {
    const servicesResponse = yield axios.get(`${ML_SERVICE_URI}`);
    const services = servicesResponse.data;

    yield put(
      actions.getServicesStateSuccess({
        services: services,
      }),
    );
  } catch (error) {
    yield put(actions.getServicesStateFailure(error.toLocaleString()));
  }
}

export function* servicePageSaga() {
  yield takeLatest(actions.getServicesState.type, getServiceState);
}
