import * as React from 'react';
import { memo } from 'react';
import { Tag } from 'antd';

interface Props {
  record?: Record<string, string>;
  title: string;
}

export const RecordTags = memo((props: Props) => {
  return (
    <>
      {props.record && (
        <div>
          {Object.entries(props.record).map(item => (
            <Tag color="blue">
              {item[0]}: {item[1]}
            </Tag>
          ))}
        </div>
      )}
    </>
  );
});
