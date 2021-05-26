/**
 * Asynchronously loads the component for ExperimentPage
 */

import { lazyLoad } from 'utils/loadable';

export const ExperimentRunComparePage = lazyLoad(
  () => import('./index'),
  module => module.ExperimentRunComparePage,
);
