/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const ModelTag = lazyLoad(
  () => import('./index'),
  module => module.ModelTag,
);
