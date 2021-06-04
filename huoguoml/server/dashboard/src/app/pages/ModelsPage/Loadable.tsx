/**
 * Asynchronously loads the component for ExperimentPage
 */

import { lazyLoad } from 'utils/loadable';

export const ModelsPage = lazyLoad(
  () => import('./index'),
  module => module.ModelsPage,
);
