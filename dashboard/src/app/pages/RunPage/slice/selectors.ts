import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.runPage || initialState;

export const selectRunPage = createSelector([selectSlice], state => state);
