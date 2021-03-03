/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const RecordTags = lazyLoad(
  () => import('./index'),
  module => module.RecordTags,
);
