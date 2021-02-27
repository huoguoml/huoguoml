/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const ExperimentTable = lazyLoad(
  () => import('./index'),
  module => module.ExperimentTable,
);
