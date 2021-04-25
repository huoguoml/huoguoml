/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const RegisterModelButton = lazyLoad(
  () => import('./index'),
  module => module.RegisterModelButton,
);
