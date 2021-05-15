/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const StatusIcon = lazyLoad(
  () => import('./index'),
  module => module.StatusIcon,
);
