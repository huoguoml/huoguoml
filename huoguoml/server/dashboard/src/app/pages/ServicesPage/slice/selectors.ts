import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.servicesPage || initialState;

export const selectServicesPageState = createSelector(
  [selectSlice],
  state => state,
);
