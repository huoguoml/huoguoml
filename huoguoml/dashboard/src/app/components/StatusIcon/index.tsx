import * as React from 'react';
import { memo } from 'react';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

interface Props {
  status_code: number;
  text?: string;
}

export const StatusIcon = memo((props: Props) => {
  return (
    <>
      <div className={'status-icon'}>
        {props.status_code === 1 && (
          <CheckCircleOutlined className={'success'} />
        )}
        {props.status_code === -1 && (
          <SyncOutlined className={'processing'} spin={true} />
        )}
        {props.status_code === 0 && <CloseCircleOutlined className={'error'} />}{' '}
        {props.text}
      </div>
    </>
  );
});
