/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const RecordTable = lazyLoad(
  () => import('./index'),
  module => module.RecordTable,
);
