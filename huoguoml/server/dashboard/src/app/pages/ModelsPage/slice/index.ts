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
    getModelsState(state) {
      state.isLoading = true;
    },
    getModelsStateSuccess(state, action: PayloadAction<ModelsPageState>) {
      state.isLoading = false;
    },
    getModelsStateFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
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
