import * as React from 'react';
import { memo } from 'react';
import { Breadcrumb, Typography } from 'antd';
import { ContentCard } from '../ContentCard/Loadable';

interface Props {
  children: React.ReactNode[];
  contentUri: string[];
}

export const ExperimentContentLayout = memo((props: Props) => {
  return (
    <>
      <div style={{ margin: '16px 16px' }}>
        <Breadcrumb>
          {props.contentUri.map(uri => (
            <Breadcrumb.Item>{uri}</Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </div>
      {props.children.map(child => (
        <ContentCard>{child}</ContentCard>
      ))}
    </>
  );
});
