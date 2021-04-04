/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const RunTable = lazyLoad(
  () => import('./index'),
  module => module.RunTable,
);
