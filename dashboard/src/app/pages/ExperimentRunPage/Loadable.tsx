/**
 * Asynchronously loads the component for ExperimentPage
 */

import { lazyLoad } from 'utils/loadable';

export const ExperimentRunPage = lazyLoad(
  () => import('./index'),
  module => module.ExperimentRunPage,
);
