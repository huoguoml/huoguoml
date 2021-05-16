import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { RunInterface } from '../../../types';
import { Table } from 'antd';
import { StatusTag } from '../StatusTag/Loadable';

interface Props {
  runs: RunInterface[];
  parameter_key: string;
  isLoading?: boolean;
}

const getUniqueKeys = (runs: RunInterface[], field_name: string) => {
  const record_keys = runs.flatMap(run => Object.keys(run[field_name]));
  return Array.from(new Set(record_keys));
};

export const ParameterTable = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const uniqueKeys = getUniqueKeys(props.runs, 'metrics');

  const data = props.runs.map(run => {
    return {
      metrics: uniqueKeys.map(key =>
        run.metrics ? run.metrics[key] : undefined,
      ),
      run_nr: run.run_nr,
    };
  });
  console.log(data);
  const columns: any = [
    {
      title: 'metrics',
      dataIndex: 'metrics',
      key: 'metrics',
      fixed: 'left',
    },
  ];

  return (
    <>
      <Table
        size="small"
        scroll={{ x: 'max-content' }}
        dataSource={data}
        columns={columns}
        loading={props.isLoading}
      />
    </>
  );
});
