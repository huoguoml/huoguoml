import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { experimentRunCompareSaga } from './saga';
import { ExperimentRunCompareState } from './types';

export const initialState: ExperimentRunCompareState = { runs: [] };

const slice = createSlice({
  name: 'experimentRunComparePage',
  initialState,
  reducers: {
    getExperimentRunCompareState(state, action: PayloadAction<string>) {
      state.isLoading = true;
    },
    getExperimentRunCompareStateSuccess(
      state,
      action: PayloadAction<ExperimentRunCompareState>,
    ) {
      state.runs = action.payload.runs;
      state.isLoading = false;
    },
    getExperimentRunCompareStateFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { actions: compareRunPageActions } = slice;

export const useExperimentRunComparePageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: experimentRunCompareSaga });
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
