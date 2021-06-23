import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { modelPageSaga } from './saga';
import { ModelPageState } from './types';

export const initialState: ModelPageState = {};

const slice = createSlice({
  name: 'modelPage',
  initialState,
  reducers: {
    getModelState(state, action: PayloadAction<string>) {
      state.isLoading = true;
      state.run = undefined;
      state.ml_model = undefined;
      state.error = undefined;
    },
    getModelStateSuccess(state, action: PayloadAction<ModelPageState>) {
      state.ml_model = action.payload.ml_model;
      state.run = action.payload.run;
      state.isLoading = false;
      state.error = undefined;
    },
    getModelStateFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
      state.run = undefined;
      state.ml_model = undefined;
    },
  },
});

export const { actions: modelPageActions } = slice;

export const useModelPageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: modelPageSaga });
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
