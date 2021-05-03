import { AppLayoutState } from 'app/layout/AppLayout/slice/types';
import { ExperimentPageState } from '../app/pages/ExperimentPage/slice/types';
import { ExperimentRunPageState } from '../app/pages/ExperimentRunPage/slice/types';
import { ServicesPageState } from '../app/pages/ServicesPage/slice/types';
import { ModelPageState } from '../app/pages/ModelPage/slice/types';

export interface PageState {
  isLoading?: boolean;
  error?: string;
}

export interface RootState {
  appLayout?: AppLayoutState;
  experimentPage?: ExperimentPageState;
  experimentRunPage?: ExperimentRunPageState;
  servicesPage?: ServicesPageState;
  modelPage?: ModelPageState;
}
