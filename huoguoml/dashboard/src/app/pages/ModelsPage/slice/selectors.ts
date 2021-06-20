import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.modelsPage || initialState;

export const selectModelsPageState = createSelector(
  [selectSlice],
  state => state,
);
