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

  const uniqueKeys = getUniqueKeys(props.runs, props.parameter_key);
  const data = uniqueKeys.map((key, id) => {
    return {
      key: key,
      ...props.runs.map(run => {
        return {
          id: run.run_nr,
          value: run[props.parameter_key]
            ? run[props.parameter_key][key]
            : undefined,
        };
      }),
    };
  });

  const metric_column: any = [
    {
      title: 'Run',
      dataIndex: 'key',
      key: 'key',
      fixed: 'left',
      sorter: (a, b) => a.key.localeCompare(b.key),
    },
  ];

  const run_columns = Array(props.runs.length)
    .fill(0)
    .map((_, index) => {
      return {
        title: props.runs[index].run_nr,
        dataIndex: [index, 'value'],
        key: `value_${index}`,
        sorter: (a, b) =>
          String(a[index]['value']).localeCompare(String(b[index]['value'])),
      };
    });

  return (
    <>
      <Table
        size="small"
        scroll={{ x: 'max-content' }}
        dataSource={data}
        columns={[...metric_column, ...run_columns]}
        loading={props.isLoading}
        pagination={false}
      />
    </>
  );
});
