/**
 * Asynchronously loads the component for ExperimentPage
 */

import { lazyLoad } from 'utils/loadable';

export const ExperimentPage = lazyLoad(
  () => import('./index'),
  module => module.ExperimentPage,
);
