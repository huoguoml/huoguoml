/**
 * Asynchronously loads the component for ExperimentPage
 */

import { lazyLoad } from 'utils/loadable';

export const ModelRegistryPage = lazyLoad(
  () => import('./index'),
  module => module.ModelRegistryPage,
);
