import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { modelComparePageSaga } from './saga';
import { ModelComparePageState } from './types';

export const initialState: ModelComparePageState = {};

const slice = createSlice({
  name: 'modelComparePage',
  initialState,
  reducers: {
    getModelsState(state, action: PayloadAction<string>) {
      state.isLoading = true;
    },
    getModelsStateSuccess(state, action: PayloadAction<ModelComparePageState>) {
      state.ml_models = action.payload.ml_models;
      state.isLoading = false;
    },
    getModelsStateFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    getBaseModelState(state, action: PayloadAction<string>) {
      state.isLoading = true;
    },
    getBaseModelStateSuccess(
      state,
      action: PayloadAction<ModelComparePageState>,
    ) {
      state.base = action.payload.base;
      state.base_run = action.payload.base_run;
      state.isLoading = false;
    },
    getBaseModelStateFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { actions: modelComparePageActions } = slice;

export const useModelComparePageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: modelComparePageSaga });
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
