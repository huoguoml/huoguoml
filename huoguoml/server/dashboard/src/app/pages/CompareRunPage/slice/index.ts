import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { compareRunPageSaga } from './saga';
import { CompareRunPageState } from './types';

export const initialState: CompareRunPageState = { runs: [] };

const slice = createSlice({
  name: 'compareRunPage',
  initialState,
  reducers: {
    getCompareRunState(state, action: PayloadAction<string>) {
      state.isLoading = true;
    },
    getCompareRunStateSuccess(
      state,
      action: PayloadAction<CompareRunPageState>,
    ) {
      state.runs = action.payload.runs;
      state.isLoading = false;
    },
    getCompareRunStateFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { actions: compareRunPageActions } = slice;

export const useCompareRunPageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: compareRunPageSaga });
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
