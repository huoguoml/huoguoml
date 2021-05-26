/* --- STATE --- */
import { PageState } from '../../../../types/RootState';
import { MLModelInterface } from '../../../../types';

export interface ModelDetailPageState extends PageState {
  ml_models: MLModelInterface[];
}
