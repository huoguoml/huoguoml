import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { runPageSaga } from './saga';
import { RunPageState } from './types';

export const initialState: RunPageState = {};

const slice = createSlice({
  name: 'runPage',
  initialState,
  reducers: {
    getRunState(state, action: PayloadAction<string>) {
      state.isLoading = true;
    },
    getRunStateSuccess(state, action: PayloadAction<RunPageState>) {
      state.run = action.payload.run;
      state.isLoading = false;
    },
    getRunStateFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { actions: runPageActions } = slice;

export const useRunPageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: runPageSaga });
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
