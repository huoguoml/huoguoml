import * as React from 'react';
import { memo } from 'react';
import { Breadcrumb } from 'antd';
import { useHistory } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  contentUri: string[];
  skipUri?: string[];
}

export const ContentCardLayout = memo((props: Props) => {
  let history = useHistory();

  function toPage(uri: string) {
    history.push(uri);
  }

  return (
    <>
      <div style={{ margin: '16px 16px' }}>
        <Breadcrumb>
          {props.contentUri.map((uri, index) => (
            <Breadcrumb.Item key={`${uri}_${index}`}>
              {props.skipUri && props.skipUri.find(skip => skip === uri) ? (
                uri
              ) : (
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
      <div key={`content_card`} className="site-layout-card">
        {props.children}
      </div>
    </>
  );
});
