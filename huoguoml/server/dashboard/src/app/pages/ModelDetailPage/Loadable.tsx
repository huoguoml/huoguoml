/**
 * Asynchronously loads the component for ExperimentPage
 */

import { lazyLoad } from 'utils/loadable';

export const ModelDetailPage = lazyLoad(
  () => import('./index'),
  module => module.ModelDetailPage,
);
