import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { modelDetailPageSaga } from './saga';
import { ModelDetailPageState } from './types';

export const initialState: ModelDetailPageState = {
  model: { name: '', ml_models: [] },
};

const slice = createSlice({
  name: 'modelDetailPage',
  initialState,
  reducers: {
    getModelDetailState(state, action: PayloadAction<string>) {
      state.isLoading = true;
    },
    getModelDetailStateSuccess(
      state,
      action: PayloadAction<ModelDetailPageState>,
    ) {
      state.model = action.payload.model;
      state.isLoading = false;
    },
    getModelDetailStateFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { actions: modelDetailPageActions } = slice;

export const useModelDetailPageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: modelDetailPageSaga });
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
