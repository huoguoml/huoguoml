import * as React from 'react';
import { memo } from 'react';
import { Table } from 'antd';

interface Props {
  record?: Record<string, string>;
  title: string;
}

export const RecordTable = memo((props: Props) => {
  const columns: any = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => String(a.name).localeCompare(String(b.name)),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      sorter: (a, b) => String(a.value).localeCompare(String(b.value)),
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
