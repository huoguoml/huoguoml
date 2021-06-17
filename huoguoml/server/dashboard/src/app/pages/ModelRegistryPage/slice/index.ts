import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { modelRegistryPageSaga } from './saga';
import { ModelRegistryPageState } from './types';

export const initialState: ModelRegistryPageState = {
  ml_registry: [],
};

const slice = createSlice({
  name: 'modelRegistryPage',
  initialState,
  reducers: {
    getModelRegistryState(state, action: PayloadAction<string>) {
      state.isLoading = true;
    },
    getModelRegistryStateSuccess(
      state,
      action: PayloadAction<ModelRegistryPageState>,
    ) {
      state.ml_registry = action.payload.ml_registry;
      state.isLoading = false;
    },
    getModelRegistryStateFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { actions: modelRegistryPageActions } = slice;

export const useModelRegistryPageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: modelRegistryPageSaga });
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
