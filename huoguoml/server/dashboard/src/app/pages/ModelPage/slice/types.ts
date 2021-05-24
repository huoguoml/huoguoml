/* --- STATE --- */
import { PageState } from '../../../../types/RootState';
import { MLModelRegistryInterface } from '../../../../types';

export interface ModelPageState extends PageState {
  ml_registry: MLModelRegistryInterface[];
}
