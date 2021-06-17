import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { RunInterface } from '../../../../types';
import { Table } from 'antd';
import { StatusTag } from '../../StatusTag/Loadable';
import { capitalize, getUniqueKeys } from '../../../../utils';

interface Props {
  runs: RunInterface[] | undefined;
  onClick: (runId: number) => void;
  selectedRuns: RunInterface[];
  setSelectedRuns: (run: RunInterface[]) => void;
  isLoading?: boolean;
}

export const RunTable = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const fixedColumns: any = [
    {
      title: 'Nr',
      dataIndex: 'run_nr',
      key: 'run_nr',
      fixed: 'left',
      sorter: (a, b) => a.run_nr - b.run_nr,
      render: run_nr => (
        <>
          <a onClick={() => props.onClick && props.onClick(run_nr)}>{run_nr}</a>
        </>
      ),
    },
  ];

  const nonFixedColumns = [
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      sorter: (a, b) => a.status - b.status,
      render: status => (
        <>
          <StatusTag status_code={status} />
        </>
      ),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      sorter: (a, b) => a.author.localeCompare(b.author),
    },
    {
      title: 'Model',
      dataIndex: ['model_definition', 'model_api', 'module'],
      key: 'model_definition_framework',
      sorter: (a, b) =>
        (a.model_definition
          ? a.model_definition.model_api.module
          : ''
        ).localeCompare(
          b.model_definition ? b.model_definition.model_api.module : '',
        ),
    },
  ];

  const variableColumns = props.runs
    ? [
        ...getUniqueKeys(props.runs, 'metrics').map(key_name => {
          return {
            title: capitalize(key_name),
            dataIndex: ['metrics', key_name],
            key: key_name,
            sorter: (a, b) =>
              String(a.metrics[key_name]).localeCompare(
                String(b.metrics[key_name]),
              ),
          };
        }),
        ...getUniqueKeys(props.runs, 'parameters').map(key_name => {
          return {
            title: capitalize(key_name),
            dataIndex: ['parameters', key_name],
            key: key_name,
            sorter: (a, b) =>
              String(a.parameters[key_name]).localeCompare(
                String(b.parameters[key_name]),
              ),
          };
        }),
        ...getUniqueKeys(props.runs, 'tags').map(key_name => {
          return {
            title: capitalize(key_name),
            dataIndex: ['tags', key_name],
            key: key_name,
            sorter: (a, b) =>
              String(a.tags[key_name]).localeCompare(String(b.tags[key_name])),
          };
        }),
      ]
    : [];

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    props.setSelectedRuns(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys: props.selectedRuns.map(run => run.run_nr),
    onChange: onSelectChange,
  };

  return (
    <>
      <Table
        rowKey={run => run.run_nr}
        size="small"
        rowSelection={rowSelection}
        scroll={{ x: 'max-content' }}
        dataSource={props.runs}
        columns={[...fixedColumns, ...nonFixedColumns, ...variableColumns]}
        loading={props.isLoading}
      />
    </>
  );
});
