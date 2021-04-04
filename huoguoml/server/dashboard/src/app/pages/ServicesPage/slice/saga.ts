import { put, takeLatest } from 'redux-saga/effects';
import { runPageActions as actions } from '.';
import axios from 'axios';
import { SERVICE_URI } from '../../../../constants';

function* getServiceState() {
  try {
    const servicesResponse = yield axios.get(`${SERVICE_URI}`);
    const services = servicesResponse.data;
    services.sort((a, b) => b.id - a.id);

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
