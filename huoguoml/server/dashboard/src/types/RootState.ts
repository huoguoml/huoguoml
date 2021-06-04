import { AppLayoutState } from 'app/layout/AppLayout/slice/types';
import { ExperimentPageState } from '../app/pages/ExperimentPage/slice/types';
import { ExperimentRunPageState } from '../app/pages/ExperimentRunPage/slice/types';
import { ServicesPageState } from '../app/pages/ServicesPage/slice/types';
import { ModelRegistryPageState } from '../app/pages/ModelRegistryPage/slice/types';
import { ExperimentRunCompareState } from '../app/pages/ExperimentRunComparePage/slice/types';
import { ModelsPageState } from '../app/pages/ModelsPage/slice/types';
import { RunPageState } from '../app/pages/RunPage/slice/types';
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
  modelRegistryPage?: ModelRegistryPageState;
  modelsPage?: ModelsPageState;
  modelPage?: ModelPageState;
  experimentRunComparePage?: ExperimentRunCompareState;
  runPage?: RunPageState;
}
