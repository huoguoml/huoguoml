import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Result } from 'antd';

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>HuoguoML | 404 Page</title>
        <meta name="description" content="Page not found" />
      </Helmet>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
      />
    </>
  );
}
