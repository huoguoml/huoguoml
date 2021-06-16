/**
 * Asynchronously loads the component for ExperimentPage
 */

import { lazyLoad } from 'utils/loadable';

export const ModelComparePage = lazyLoad(
  () => import('./index'),
  module => module.ModelComparePage,
);
