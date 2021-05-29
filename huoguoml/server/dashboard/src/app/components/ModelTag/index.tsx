import * as React from 'react';
import { memo } from 'react';
import { Tag } from 'antd';

interface Props {
  tag: number;
}

export const ModelTag = memo((props: Props) => {
  return (
    <>
      <div>
        {props.tag === 1 && (
          <Tag color="green" key="completed">
            {'Production'}
          </Tag>
        )}
        {props.tag === 0 && (
          <Tag color="yellow" key="pending">
            {'Staging'}
          </Tag>
        )}
      </div>
    </>
  );
});
