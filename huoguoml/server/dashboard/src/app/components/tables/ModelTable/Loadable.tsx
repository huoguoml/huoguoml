/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const ModelTable = lazyLoad(
  () => import('./index'),
  module => module.ModelTable,
);
