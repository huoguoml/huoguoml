import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceInterface } from '../../../types';
import { Table, Typography } from 'antd';

interface Props {
  services?: ServiceInterface[];
}

export const ServiceTable = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const fixedColumns: any = [
    {
      title: 'Service',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['ascend'],
      fixed: 'left',
    },
  ];

  const nonFixedColumns = [
    {
      title: 'Host',
      dataIndex: 'host',
      key: 'host',
      sorter: (a, b) => a.host.localeCompare(b.host),
    },
    {
      title: 'Port',
      dataIndex: 'port',
      key: 'port',
      sorter: (a, b) => a.port - b.port,
    },
    {
      title: 'Run',
      dataIndex: 'run_id',
      key: 'run_id',
    },
  ];

  const { Title } = Typography;

  return (
    <>
      <Title level={4}>Services</Title>
      <Table
        rowKey={service => service.id}
        size="small"
        scroll={{ x: 'max-content' }}
        dataSource={props.services}
        columns={[...fixedColumns, ...nonFixedColumns]}
      />
    </>
  );
});
