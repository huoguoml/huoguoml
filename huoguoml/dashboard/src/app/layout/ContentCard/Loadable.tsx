/**
 * Asynchronously loads the component for ExperimentPage
 */

import { lazyLoad } from 'utils/loadable';

export const ContentCard = lazyLoad(
  () => import('./index'),
  module => module.ContentCard,
);
