import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { RunInterface } from '../../../types';
import { Table, Typography } from 'antd';
import { StatusTag } from '../StatusTag/Loadable';

interface Props {
  runs: RunInterface[];
  defaultRuns: RunInterface[];
  setSelectedRows: (run: RunInterface[]) => void;
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

export const RunTable = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

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
  ];

  const nonFixedColumns = [
    {
      title: 'Start Time',
      dataIndex: 'creation_time',
      key: 'creation_time',
      sorter: (a, b) => a.creation_time - b.creation_time,
      render: creation_time => <div>{timestampToDate(creation_time)}</div>,
    },
    {
      title: 'End Time',
      dataIndex: 'finish_time',
      key: 'finish_time',
      sorter: (a, b) => a.finish_time - b.finish_time,
      render: finish_time => (
        <div>{finish_time === -1 ? '' : timestampToDate(finish_time)}</div>
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status - b.status,
      render: status => <StatusTag status_code={status} />,
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      sorter: (a, b) => a.author.localeCompare(b.author),
    },
  ];

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    props.setSelectedRows(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys: props.defaultRuns.map(run => run.run_nr),
    onChange: onSelectChange,
  };

  const { Title } = Typography;

  return (
    <>
      <Title level={4}>Experiment Runs</Title>

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
