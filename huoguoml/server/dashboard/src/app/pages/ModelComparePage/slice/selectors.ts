import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.modelComparePage || initialState;

export const selectModelComparePageState = createSelector(
  [selectSlice],
  state => state,
);
