import { put, takeLatest } from 'redux-saga/effects';
import { appLayoutActions as actions } from '.';
import { EXPERIMENT_URI } from '../../../constants';
import axios from 'axios';

function* getLayoutState() {
  try {
    const experimentsResponse = yield axios.get(EXPERIMENT_URI);
    yield put(
      actions.getLayoutStateSuccess({
        experiments: experimentsResponse.data,
      }),
    );
  } catch (error) {
    yield put(actions.getLayoutStateFailure(error.toLocaleString()));
  }
}

export function* appLayoutSaga() {
  yield takeLatest(actions.getLayoutState.type, getLayoutState);
}
