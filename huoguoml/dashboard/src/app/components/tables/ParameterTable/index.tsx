import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { RunInterface } from '../../../../types';
import { Table } from 'antd';
import { capitalize, getUniqueKeys } from '../../../../utils';

interface Props {
  runs: RunInterface[];
  parameter_key: string;
  isLoading?: boolean;
}

export const ParameterTable = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const variableColumns = props.runs
    ? getUniqueKeys(props.runs, props.parameter_key).map(key_name => {
        return {
          title: capitalize(key_name),
          dataIndex: [props.parameter_key, key_name],
          key: key_name,
          sorter: (a, b) => a.metrics[key_name] - b.metrics[key_name],
        };
      })
    : [];

  const fixedColumns: any = [
    {
      title: 'Nr',
      dataIndex: 'run_nr',
      key: 'run_nr',
      fixed: 'left',
      sorter: (a, b) => a.run_nr - b.run_nr,
    },
  ];

  return (
    <>
      <Table
        size="small"
        scroll={{ x: 'max-content' }}
        dataSource={props.runs}
        columns={[...fixedColumns, ...variableColumns]}
        loading={props.isLoading}
        pagination={false}
      />
    </>
  );
});
