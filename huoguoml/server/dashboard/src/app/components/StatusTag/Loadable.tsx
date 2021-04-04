/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const StatusTag = lazyLoad(
  () => import('./index'),
  module => module.StatusTag,
);
