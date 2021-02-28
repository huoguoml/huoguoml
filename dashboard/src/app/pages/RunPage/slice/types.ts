/* --- STATE --- */
import { RunInterface } from '../../../../types';
import { PageState } from '../../../../types/RootState';

export interface RunPageState extends PageState {
  run?: RunInterface;
}
