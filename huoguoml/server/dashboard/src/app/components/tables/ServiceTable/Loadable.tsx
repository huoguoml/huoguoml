/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const ServiceTable = lazyLoad(
  () => import('./index'),
  module => module.ServiceTable,
);
