/* --- STATE --- */
import { PageState } from '../../../../types/RootState';
import { MLModelInterface } from '../../../../types';

export interface ModelPageState extends PageState {
  model: MLModelInterface;
}
