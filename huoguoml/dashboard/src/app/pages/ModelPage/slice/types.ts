/* --- STATE --- */
import { PageState } from '../../../../types/RootState';
import { MLModelInterface, RunInterface } from '../../../../types';

export interface ModelPageState extends PageState {
  ml_model?: MLModelInterface;
  run?: RunInterface;
}
