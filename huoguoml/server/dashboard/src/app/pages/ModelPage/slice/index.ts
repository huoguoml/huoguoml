import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { modelPageSaga } from './saga';
import { ModelPageState } from './types';

export const initialState: ModelPageState = {
  model: { id: -1, name: '' },
};

const slice = createSlice({
  name: 'modelPage',
  initialState,
  reducers: {
    getModelState(state, action: PayloadAction<string>) {
      state.isLoading = true;
    },
    getModelStateSuccess(state, action: PayloadAction<ModelPageState>) {
      state.model = action.payload.model;
      state.isLoading = false;
    },
    getModelStateFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
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
