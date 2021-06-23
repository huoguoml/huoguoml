/**
 * Asynchronously loads the component for ExperimentPage
 */

import { lazyLoad } from 'utils/loadable';

export const ServicesPage = lazyLoad(
  () => import('./index'),
  module => module.ServicesPage,
);
