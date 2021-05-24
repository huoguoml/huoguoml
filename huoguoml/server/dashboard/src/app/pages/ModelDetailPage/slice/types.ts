/* --- STATE --- */
import { PageState } from '../../../../types/RootState';
import { MLModelRegistryInterface } from '../../../../types';

export interface ModelDetailPageState extends PageState {
  model: MLModelRegistryInterface;
}
