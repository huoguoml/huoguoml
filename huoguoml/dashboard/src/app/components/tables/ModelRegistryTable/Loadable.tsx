/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const ModelRegistryTable = lazyLoad(
  () => import('./index'),
  module => module.ModelRegistryTable,
);
