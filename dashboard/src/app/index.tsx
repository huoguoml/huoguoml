/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { ExperimentPage } from './pages/ExperimentPage/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';
import { AppLayout } from './layout/Loadable';

export function App() {
  const { i18n } = useTranslation();

  const content = (
    <Switch>
      <Route exact path="/" component={ExperimentPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );

  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="HuoguoML"
        defaultTitle="React Boilerplate"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="A React Boilerplate application" />
      </Helmet>

      <AppLayout content={content} />
    </BrowserRouter>
  );
}
