/* --- STATE --- */
import { PageState } from '../../../../types/RootState';
import { MLModelInterface, MLModelRegistryInterface } from '../../../../types';

export interface ModelDetailPageState extends PageState {
  model: MLModelRegistryInterface;
}
