import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.modelDetailPage || initialState;

export const selectModelDetailPageState = createSelector(
  [selectSlice],
  state => state,
);
