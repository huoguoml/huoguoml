import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './index';

const selectSlice = (state: RootState) => state.appLayout || initialState;

export const selectAppLayout = createSelector([selectSlice], state => state);
