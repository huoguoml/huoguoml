import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { RunInterface } from '../../../types';
import { Table } from 'antd';
import { StatusTag } from '../StatusTag/Loadable';
import { RunMetricCharts } from '../RunMetricCharts/Loadable';

interface Props {
  runs: RunInterface[];
  onClick: (runId: number) => void;
}

const timestampToDate = (timestamp: number) => {
  const dateObj = new Date(timestamp * 1000);
  return dateObj.toDateString() + ' ' + dateObj.toLocaleTimeString();
};

const secondsToTime = (seconds: number) => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * (24 * 60 * 60);
  const hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * (60 * 60);
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  return (
    (0 < days ? days.toFixed(0) + ' d ' : '') +
    (0 < hours ? hours.toFixed(0) + ' h ' : '') +
    (0 < minutes ? minutes.toFixed(0) + ' m ' : '') +
    (0 < seconds ? seconds.toFixed(0) + ' s ' : '')
  );
};

const getUniqueKeys = (runs: RunInterface[], field_name: string) => {
  const record_keys = runs.flatMap(run =>
    run.metrics ? Object.keys(run[field_name]) : undefined,
  );
  return Array.from(new Set(record_keys));
};

export const RunTable = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  props.runs.sort((a, b) => b.run_nr - a.run_nr);

  const fixedColumns: any = [
    {
      title: 'Run',
      dataIndex: 'run_nr',
      key: 'run_nr',
      sorter: (a, b) => a.run_nr - b.run_nr,
      sortDirections: ['ascend'],
      fixed: 'left',
      render: id => (
        <a onClick={() => props.onClick && props.onClick(id)}>{id}</a>
      ),
    },
    {
      title: 'Start Time',
      dataIndex: 'creation_time',
      key: 'creation_time',
      sorter: (a, b) => a.creation_time - b.creation_time,
      sortDirections: ['ascend'],
      render: creation_time => <div>{timestampToDate(creation_time)}</div>,
    },
  ];

  const nonFixedColumns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: status => <StatusTag status_code={-1} />,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      sorter: (a, b) => a.creation_time - b.creation_time,
      render: duration => <div>{secondsToTime(parseFloat(duration))}</div>,
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      sorter: (a, b) => a.author.localeCompare(b.author),
    },
  ];

  // const metricColumns = getUniqueKeys(props.runs, 'metrics').map(key_name => {
  //   return {
  //     title: key_name,
  //     dataIndex: ['metrics', key_name],
  //     key: key_name,
  //   };
  // });

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const [selectedRows, setSelectedRows] = React.useState<RunInterface[]>(
    props.runs.slice(0, 5),
  );

  const rowSelection = {
    selectedRowKeys: selectedRows.map(run => run.run_nr),
    onChange: onSelectChange,
  };
  return (
    <>
      <RunMetricCharts runs={selectedRows} />
      <Table
        rowKey={run => run.run_nr}
        size="small"
        rowSelection={rowSelection}
        scroll={{ x: 'max-content' }}
        dataSource={props.runs}
        columns={[...fixedColumns, ...nonFixedColumns]}
      />
    </>
  );
});
