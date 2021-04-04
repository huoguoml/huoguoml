/**
 * Asynchronously loads the component for ExperimentPage
 */

import { lazyLoad } from 'utils/loadable';

export const ContentCardLayout = lazyLoad(
  () => import('./index'),
  module => module.ContentCardLayout,
);
