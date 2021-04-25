/**
 * Asynchronously loads the component for ExperimentPage
 */

import { lazyLoad } from 'utils/loadable';

export const ModelPage = lazyLoad(
  () => import('./index'),
  module => module.ModelPage,
);
