import * as React from 'react';
import { memo } from 'react';
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

interface Props {
  status_code: number;
}

export const StatusTag = memo((props: Props) => {
  return (
    <>
      <div>
        {props.status_code > 0 && (
          <Tag
            color="green"
            key="completed"
            icon={<CheckCircleOutlined style={{ verticalAlign: 'middle' }} />}
          >
            {'Completed'}
          </Tag>
        )}
        {props.status_code === 0 && (
          <Tag
            color="green"
            key="pending"
            icon={<SyncOutlined style={{ verticalAlign: 'middle' }} />}
          >
            {'Pending'}
          </Tag>
        )}
        {props.status_code < 0 && (
          <Tag
            color="red"
            key="failed"
            icon={<CloseCircleOutlined style={{ verticalAlign: 'middle' }} />}
          >
            {'Failed'}
          </Tag>
        )}
      </div>
    </>
  );
});
