/* --- STATE --- */
import { ExperimentInterface } from '../../../../types';
import { PageState } from '../../../../types/RootState';

export interface AppLayoutState extends PageState {
  experiments?: ExperimentInterface[];
}
