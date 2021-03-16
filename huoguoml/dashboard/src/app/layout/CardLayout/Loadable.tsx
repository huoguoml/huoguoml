/**
 * Asynchronously loads the component for ExperimentPage
 */

import { lazyLoad } from 'utils/loadable';

export const CardLayout = lazyLoad(
  () => import('./index'),
  module => module.CardLayout,
);
