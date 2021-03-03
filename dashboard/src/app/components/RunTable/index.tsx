import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { RunInterface } from '../../../types';
import { Table, Tag } from 'antd';

interface Props {
  runs: RunInterface[];
  onClick: (runId: number) => void;
}

const timestampToDate = (timestamp: number) => {
  const dateObj = new Date(timestamp * 1000);
  return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();
};

const secondsToTime = (seconds: number) => {
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
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

  const columns: any = [
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
      fixed: 'left',
      render: creation_time => <div>{timestampToDate(creation_time)}</div>,
    },
    {
      title: 'Metrics',
      children: getUniqueKeys(props.runs, 'metrics').map(key_name => {
        return {
          title: key_name,
          dataIndex: ['metrics', key_name],
          key: key_name,
        };
      }),
    },
    {
      title: 'Parameters',
      children: getUniqueKeys(props.runs, 'parameters').map(key_name => {
        return {
          title: key_name,
          dataIndex: ['parameters', key_name],
          key: key_name,
        };
      }),
    },
    {
      title: 'Tags',
      children: getUniqueKeys(props.runs, 'tags').map(key_name => {
        return {
          title: key_name,
          dataIndex: ['tags', key_name],
          key: key_name,
        };
      }),
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
      sorter: (a, b) => a.creation_time - b.creation_time,
    },
  ];

  return (
    <>
      <Table
        size="small"
        scroll={{ x: 'max-content' }}
        dataSource={props.runs}
        columns={columns}
      />
    </>
  );
});
