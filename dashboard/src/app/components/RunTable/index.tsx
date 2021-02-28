import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { RunInterface } from '../../../types';
import { Table } from 'antd';

interface Props {
  runs?: RunInterface[];
  onClick?: (runId: number) => void;
}

export const RunTable = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  props.runs?.sort((a, b) => b.id - a.id);

  const columns: any = [
    {
      title: 'Run',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['ascend'],
      render: id => (
        <a onClick={() => props.onClick && props.onClick(id)}>{id}</a>
      ),
    },
    {
      title: 'Creation Time',
      dataIndex: 'creation_time',
      key: 'creation_time',
      sorter: (a, b) => a.creation_time - b.creation_time,
      sortDirections: ['ascend'],
    },
  ];

  return (
    <>
      <Table size="small" dataSource={props.runs} columns={columns} />
    </>
  );
});
