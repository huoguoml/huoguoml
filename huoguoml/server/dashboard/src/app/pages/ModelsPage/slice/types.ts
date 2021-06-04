/* --- STATE --- */
import { PageState } from '../../../../types/RootState';
import { MLModelInterface } from '../../../../types';

export interface ModelsPageState extends PageState {
  ml_models: MLModelInterface[];
}
