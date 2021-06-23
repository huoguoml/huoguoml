import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { modelsPageSaga } from './saga';
import { ModelsPageState } from './types';

export const initialState: ModelsPageState = {};

const slice = createSlice({
  name: 'modelsPage',
  initialState,
  reducers: {
    getModelsState(state, action: PayloadAction<string>) {
      state.isLoading = true;
      state.ml_models = undefined;
      state.error = undefined;
    },
    getModelsStateSuccess(state, action: PayloadAction<ModelsPageState>) {
      state.ml_models = action.payload.ml_models;
      state.isLoading = false;
      state.error = undefined;
    },
    getModelsStateFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
      state.ml_models = undefined;
    },
  },
});

export const { actions: modelsPageActions } = slice;

export const useModelsPageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: modelsPageSaga });
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
