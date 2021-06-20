import * as React from 'react';
import { memo } from 'react';
import { Tag } from 'antd';

interface Props {
  record?: Record<string, string>;
}

export const RecordTags = memo((props: Props) => {
  return (
    <>
      {props.record &&
        Object.entries(props.record).map(item => (
          <Tag color="blue" key={item[0]}>
            {item[0]}: {item[1]}
          </Tag>
        ))}
    </>
  );
});
