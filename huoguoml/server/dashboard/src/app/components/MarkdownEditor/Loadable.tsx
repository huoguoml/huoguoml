/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const MarkdownEditor = lazyLoad(
  () => import('./index'),
  module => module.MarkdownEditor,
);
