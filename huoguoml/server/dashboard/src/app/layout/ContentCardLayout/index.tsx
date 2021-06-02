import * as React from 'react';
import { memo } from 'react';
import { Breadcrumb } from 'antd';
import { useHistory } from 'react-router-dom';

interface Props {
  children: React.ReactNode[];
  contentUri: string[];
  skip?: number;
}

export const ContentCardLayout = memo((props: Props) => {
  let history = useHistory();

  function toPage(uri: string) {
    history.push(uri);
  }

  const skip = props.skip ? props.skip : 0;
  return (
    <>
      <div style={{ margin: '16px 16px' }}>
        <Breadcrumb>
          {props.contentUri.map((uri, index) => (
            <Breadcrumb.Item key={`${uri}_${index}`}>
              {index <= skip && uri}
              {index > skip && (
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
        <div key={`content_card_${index}`} className="site-layout-card">
          {child}
        </div>
      ))}
    </>
  );
});
