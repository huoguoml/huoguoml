/**
 * Asynchronously loads the component for ExperimentPage
 */

import { lazyLoad } from 'utils/loadable';

export const ExperimentContentLayout = lazyLoad(
  () => import('./index'),
  module => module.ExperimentContentLayout,
);
