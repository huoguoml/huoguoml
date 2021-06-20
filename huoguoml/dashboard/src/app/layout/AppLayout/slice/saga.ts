import { put, takeLatest } from 'redux-saga/effects';
import { appLayoutActions as actions } from './index';
import { EXPERIMENT_URI } from '../../../../constants';
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

export function* appLayoutSaga() {
  yield takeLatest(actions.getLayoutState.type, getLayoutStateExperiments);
  // yield takeLatest(actions.getLayoutState.type, getLayoutStateMLModels);
}
