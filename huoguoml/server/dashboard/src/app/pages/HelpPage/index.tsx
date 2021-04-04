import * as React from 'react';
import { CardLayout } from '../../layout/CardLayout/Loadable';
import { GithubOutlined, BookOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

export function HelpPage() {
  const { Title } = Typography;

  return (
    <>
      <CardLayout contentUri={['help']}>
        <a
          href="https://github.com/HuoguoML/HuoguoML"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Title level={3}>
            Visit us on GitHub <GithubOutlined />
          </Title>
        </a>
        <a
          href="https://steven-mi.gitbook.io/huoguoml/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Title level={3}>
            Visit our Documentation <BookOutlined />
          </Title>
        </a>
      </CardLayout>
    </>
  );
}
