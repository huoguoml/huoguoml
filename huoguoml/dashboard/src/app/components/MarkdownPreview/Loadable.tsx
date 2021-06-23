/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const MarkdownPreview = lazyLoad(
  () => import('./index'),
  module => module.MarkdownPreview,
);
