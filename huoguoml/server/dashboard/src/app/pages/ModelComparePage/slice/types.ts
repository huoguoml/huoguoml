/* --- STATE --- */
import { PageState } from '../../../../types/RootState';
import { MLModelInterface, RunInterface } from '../../../../types';

export interface ModelComparePageState extends PageState {
  compare?: MLModelInterface;
  compare_run?: RunInterface;
  base?: MLModelInterface;
  base_run?: RunInterface;
  ml_models?: MLModelInterface[];
}
