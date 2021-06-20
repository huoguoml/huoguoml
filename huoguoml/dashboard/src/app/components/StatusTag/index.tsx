import * as React from 'react';
import { memo } from 'react';
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

interface Props {
  status_code: number | undefined;
}

export const StatusTag = memo((props: Props) => {
  return (
    <>
      <div>
        {props.status_code === 1 && (
          <Tag color="green" key="completed" icon={<CheckCircleOutlined />}>
            {'Completed'}
          </Tag>
        )}
        {props.status_code === -1 && (
          <Tag color="blue" key="pending" icon={<SyncOutlined spin={true} />}>
            {'Pending'}
          </Tag>
        )}
        {props.status_code === 0 && (
          <Tag color="red" key="failed" icon={<CloseCircleOutlined />}>
            {'Failed'}
          </Tag>
        )}
      </div>
    </>
  );
});
