/**
 * Asynchronously loads the component for ExperimentPage
 */

import { lazyLoad } from 'utils/loadable';

export const ContentCardsLayout = lazyLoad(
  () => import('./index'),
  module => module.ContentCardsLayout,
);
