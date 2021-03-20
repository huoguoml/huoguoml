import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.experimentPage || initialState;

export const selectExperimentPage = createSelector(
  [selectSlice],
  state => state,
);
