import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { experimentPageSaga } from './saga';
import { ExperimentPageState } from './types';
import exp from 'constants';

export const initialState: ExperimentPageState = {};

const slice = createSlice({
  name: 'experimentPage',
  initialState,
  reducers: {
    getExperimentState(state, action: PayloadAction<string>) {
      state.isLoading = true;
    },
    getExperimentStateSuccess(
      state,
      action: PayloadAction<ExperimentPageState>,
    ) {
      const experiment = action.payload.experiment;
      experiment?.runs.sort((a, b) => b.run_nr - a.run_nr);

      state.experiment = experiment;
      state.isLoading = false;
    },
    getExperimentStateFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { actions: experimentPageActions } = slice;

export const useExperimentPageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: experimentPageSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useExperimentPageSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
