import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.modelRegistryPage || initialState;

export const selectModelPageState = createSelector(
  [selectSlice],
  state => state,
);
