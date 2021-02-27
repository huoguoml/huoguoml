import { AppLayoutState } from 'app/layout/slice/types';
import { ExperimentPageState } from '../app/pages/ExperimentPage/slice/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

export interface PageState {
  isLoading?: boolean;
  error?: string;
}

export interface RootState {
  appLayout?: AppLayoutState;
  experimentPage?: ExperimentPageState;
}
