/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const RunMetricCharts = lazyLoad(
  () => import('./index'),
  module => module.RunMetricCharts,
);
