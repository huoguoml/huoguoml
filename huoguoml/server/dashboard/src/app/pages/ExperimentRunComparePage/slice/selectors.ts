import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.experimentRunComparePage || initialState;

export const selectExperimentRunCompareState = createSelector(
  [selectSlice],
  state => state,
);
