import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.experimentRunPage || initialState;

export const selectExperimentRunPage = createSelector(
  [selectSlice],
  state => state,
);
