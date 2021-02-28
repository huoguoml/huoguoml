/* --- STATE --- */
import { PageState } from '../../../../types/RootState';
import { ExperimentInterface } from '../../../../types';

export interface ExperimentPageState extends PageState {
  experiment?: ExperimentInterface[];
}
