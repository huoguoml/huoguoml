/**
 * Asynchronously loads the component for ExperimentPage
 */

import { lazyLoad } from 'utils/loadable';

export const CompareRunPage = lazyLoad(
  () => import('./index'),
  module => module.CompareRunPage,
);
