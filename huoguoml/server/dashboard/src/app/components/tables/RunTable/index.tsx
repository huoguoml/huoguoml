import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { RunInterface } from '../../../../types';
import { Table } from 'antd';
import { StatusTag } from '../../StatusTag/Loadable';
import { secondsToTime } from '../../../../utils/time';

interface Props {
  runs: RunInterface[] | undefined;
  onClick: (runId: number) => void;
  selectedRuns: RunInterface[];
  setSelectedRuns: (run: RunInterface[]) => void;
  isLoading?: boolean;
}

const getUniqueKeys = (runs: RunInterface[], field_name: string) => {
  const record_keys = runs.flatMap(run => Object.keys(run[field_name]));
  return Array.from(new Set(record_keys));
};

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
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      sorter: (a, b) => a.creation_time - b.creation_time,
      render: duration => (
        <div>{duration === -1 ? '' : secondsToTime(parseFloat(duration))}</div>
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

  //const nonFixedColumns = [
  // {
  //   title: 'Start Time',
  //   dataIndex: 'creation_time',
  //   key: 'creation_time',
  //   sorter: (a, b) => a.creation_time - b.creation_time,
  //   render: creation_time => <div>{timestampToDate(creation_time)}</div>,
  // },
  // {
  //   title: 'End Time',
  //   dataIndex: 'finish_time',
  //   key: 'finish_time',
  //   sorter: (a, b) => a.finish_time - b.finish_time,
  //   render: finish_time => (
  //     <div>{finish_time === -1 ? '' : timestampToDate(finish_time)}</div>
  //   ),
  // },
  //];

  const variableColumns = props.runs
    ? getUniqueKeys(props.runs, 'metrics').map(key_name => {
        return {
          title: key_name,
          dataIndex: ['metrics', key_name],
          key: key_name,
          sorter: (a, b) => a.metrics[key_name] - b.metrics[key_name],
        };
      })
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
        columns={[...fixedColumns, ...variableColumns]}
        loading={props.isLoading}
      />
    </>
  );
});
