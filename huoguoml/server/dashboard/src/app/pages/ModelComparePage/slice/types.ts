/* --- STATE --- */
import { PageState } from '../../../../types/RootState';
import { MLModelInterface, RunInterface } from '../../../../types';

export interface ModelComparePageState extends PageState {
  base?: MLModelInterface;
  base_run?: RunInterface;
  ml_models?: MLModelInterface[];
}
