import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { experimentRunPageSaga } from './saga';
import { ExperimentRunPageState } from './types';

export const initialState: ExperimentRunPageState = {};

const slice = createSlice({
  name: 'experimentRunPage',
  initialState,
  reducers: {
    getExperimentRunState(state, action: PayloadAction<string>) {
      state.isLoading = true;
    },
    getExperimentRunStateSuccess(
      state,
      action: PayloadAction<ExperimentRunPageState>,
    ) {
      state.run = action.payload.run;
      state.isLoading = false;
    },
    getExperimentRunStateFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { actions: runPageActions } = slice;

export const useExperimentRunPageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: experimentRunPageSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useRunPageSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
