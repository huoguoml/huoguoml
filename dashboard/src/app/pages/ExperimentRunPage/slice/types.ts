/* --- STATE --- */
import { RunInterface } from '../../../../types';
import { PageState } from '../../../../types/RootState';

export interface ExperimentRunPageState extends PageState {
  run?: RunInterface;
}
