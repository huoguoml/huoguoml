/* --- STATE --- */
import { PageState } from '../../../../types/RootState';
import { MLModelRegistryInterface } from '../../../../types';

export interface ModelRegistryPageState extends PageState {
  ml_registry: MLModelRegistryInterface[];
}
