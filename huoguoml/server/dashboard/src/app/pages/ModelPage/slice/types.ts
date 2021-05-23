/* --- STATE --- */
import { PageState } from '../../../../types/RootState';
import { MLModelInterface, MLModelRegistryInterface } from '../../../../types';

export interface ModelPageState extends PageState {
  models: MLModelRegistryInterface[];
}
