import * as React from 'react';
import { memo } from 'react';
import { Table, Typography } from 'antd';

interface Props {
  record?: Record<string, string>;
  title: string;
}

export const RecordTable = memo((props: Props) => {
  const { Title } = Typography;

  const columns: any = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  return (
    <>
      {props.record && (
        <div>
          <Table
            size="small"
            dataSource={Object.entries(props.record).map(item => {
              return {
                name: item[0],
                value: item[1],
              };
            })}
            columns={columns}
            pagination={false}
          />
        </div>
      )}
    </>
  );
});
