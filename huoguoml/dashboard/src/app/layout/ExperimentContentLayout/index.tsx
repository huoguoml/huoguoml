import * as React from 'react';
import { memo } from 'react';
import { Breadcrumb, Typography } from 'antd';
import { ContentCard } from '../ContentCard/Loadable';
import { useHistory } from 'react-router-dom';

interface Props {
  children: React.ReactNode[];
  contentUri: string[];
}

export const ExperimentContentLayout = memo((props: Props) => {
  let history = useHistory();
  function toPage(uri: string) {
    console.log(uri);
    history.push(uri);
  }

  return (
    <>
      <div style={{ margin: '16px 16px' }}>
        <Breadcrumb>
          {props.contentUri.map((uri, index) => (
            <Breadcrumb.Item>
              {index === 0 && uri}
              {index > 0 && (
                <a
                  onClick={() =>
                    toPage('/' + props.contentUri.slice(0, index + 1).join('/'))
                  }
                >
                  {uri}
                </a>
              )}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </div>
      {props.children.map((child, index) => (
        <ContentCard key={`content_card_${index}`}>{child}</ContentCard>
      ))}
    </>
  );
});
