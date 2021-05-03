import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { appLayoutSaga } from './saga';
import { AppLayoutState } from './types';

export const initialState: AppLayoutState = {};

const slice = createSlice({
  name: 'appLayout',
  initialState,
  reducers: {
    getLayoutState(state) {
      state.isLoading = true;
    },
    getLayoutStateExperimentsSuccess(
      state,
      action: PayloadAction<AppLayoutState>,
    ) {
      state.experiments = action.payload.experiments;
      state.isLoading = false;
    },
    getLayoutStateMLModelsSuccess(
      state,
      action: PayloadAction<AppLayoutState>,
    ) {
      state.ml_models = action.payload.ml_models;
      state.isLoading = false;
    },
    getLayoutStateFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { actions: appLayoutActions } = slice;

export const useAppLayoutSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: appLayoutSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useAppLayoutSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
