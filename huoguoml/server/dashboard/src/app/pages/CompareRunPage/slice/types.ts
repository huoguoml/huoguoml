/* --- STATE --- */
import { PageState } from '../../../../types/RootState';
import { RunInterface } from '../../../../types';

export interface CompareRunPageState extends PageState {
  runs: RunInterface[];
}
