/**
 * Asynchronously loads the component for ExperimentPage
 */

import { lazyLoad } from 'utils/loadable';

export const RunPage = lazyLoad(
  () => import('./index'),
  module => module.RunPage,
);
