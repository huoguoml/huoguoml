import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from 'antd';

interface Props {
  record?: Record<string, string>;
  title: string;
}

export const RecordTable = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

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
  console.log(props.record);
  return (
    <>
      <p>{props.title}</p>
      {props.record ? (
        <Table
          size="small"
          dataSource={Object.entries(props.record).map(item => {
            return {
              name: item[0],
              value: item[1],
            };
          })}
          columns={columns}
        />
      ) : null}
    </>
  );
});
