import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { servicePageSaga } from './saga';
import { ServicesPageState } from './types';

export const initialState: ServicesPageState = {};

const slice = createSlice({
  name: 'servicesPage',
  initialState,
  reducers: {
    getServicesState(state) {
      state.isLoading = true;
    },
    getServicesStateSuccess(state, action: PayloadAction<ServicesPageState>) {
      state.services = action.payload.services;
      state.isLoading = false;
    },
    getServicesStateFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { actions: runPageActions } = slice;

export const useServicesPageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: servicePageSaga });
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
