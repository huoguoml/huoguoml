/**
 * Asynchronously loads the component for ExperimentPage
 */

import { lazyLoad } from 'utils/loadable';

export const HelpPage = lazyLoad(
  () => import('./index'),
  module => module.HelpPage,
);
