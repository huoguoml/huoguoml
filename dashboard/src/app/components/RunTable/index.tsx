import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { RunInterface } from '../../../types';
import { Table } from 'antd';

interface Props {
  runs?: RunInterface[];
  useId?: boolean;
}

export const RunTable = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const columns = [
    {
      title: 'Run',
      dataIndex: props.useId ? 'id' : 'run_nr',
      key: 'id',
    },
    {
      title: 'Creation Time',
      dataIndex: 'creation_time',
      key: 'creation_time',
    },
  ];
  return (
    <>
      <Table size="small" dataSource={props.runs} columns={columns} />
    </>
  );
});
