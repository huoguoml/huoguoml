/* --- STATE --- */
import { PageState } from '../../../../types/RootState';
import { RunInterface } from '../../../../types';

export interface RunPageState extends PageState {
  runs?: RunInterface[];
}
