/* --- STATE --- */
import { PageState } from '../../../../types/RootState';
import { RunInterface } from '../../../../types';

export interface ExperimentRunCompareState extends PageState {
  runs: RunInterface[];
}
