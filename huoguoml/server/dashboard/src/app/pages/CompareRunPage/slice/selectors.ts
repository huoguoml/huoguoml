import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.compareRunPage || initialState;

export const selectCompareRunPage = createSelector(
  [selectSlice],
  state => state,
);
