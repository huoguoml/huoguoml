import * as React from 'react';
import { memo } from 'react';
import { Tag } from 'antd';

interface Props {
  tag: number | undefined;
}

export const ModelTag = memo((props: Props) => {
  return (
    <>
      <div>
        {props.tag === 2 && (
          <Tag color="red" key="archived">
            {'Archived'}
          </Tag>
        )}
        {props.tag === 1 && (
          <Tag color="green" key="production">
            {'Production'}
          </Tag>
        )}
        {props.tag === 0 && (
          <Tag color="yellow" key="staging">
            {'Staging'}
          </Tag>
        )}
        {props.tag === -1 && <Tag key="none">{'None'}</Tag>}
      </div>
    </>
  );
});
