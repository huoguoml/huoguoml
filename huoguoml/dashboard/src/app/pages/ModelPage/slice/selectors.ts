import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.modelPage || initialState;

export const selectModelPageState = createSelector(
  [selectSlice],
  state => state,
);
