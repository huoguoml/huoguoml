import * as React from 'react';
import { memo } from 'react';
import { Breadcrumb, Col, Row } from 'antd';
import { useHistory } from 'react-router-dom';

interface Props {
  children: React.ReactNode[];
  contentUri: string[];
}

export const CardLayout = memo((props: Props) => {
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
              {index === 0 && uri}
              {index > 0 && (
                <a
                  href={`#${uri}`}
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
      <Row gutter={[0, 0]}>
        {props.children.map((child, index) => (
          <Col xs={{ span: 24 }} lg={{ span: 8 }} key={`card_col_${index}`}>
            <div
              key={`card_col_content_${index}`}
              className="site-layout-card"
              style={{
                height: 150,
              }}
            >
              {child}
            </div>
          </Col>
        ))}
      </Row>
    </>
  );
});
