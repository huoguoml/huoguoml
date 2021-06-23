/* --- STATE --- */
import { ExperimentInterface, MLModelInterface } from '../../../../types';
import { PageState } from '../../../../types/RootState';

export interface AppLayoutState extends PageState {
  experiments?: ExperimentInterface[];
  ml_models?: MLModelInterface[];
}
