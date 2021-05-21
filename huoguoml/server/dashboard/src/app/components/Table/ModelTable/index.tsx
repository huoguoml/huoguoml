import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { MLModelInterface } from '../../../../types';
import { Table, Typography } from 'antd';

interface Props {
  models?: MLModelInterface[];
  onClick: (modelName: string) => void;
}

export const ModelTable = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const fixedColumns: any = [
    {
      title: 'Model',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      fixed: 'left',
      render: modelName => (
        <>
          <a onClick={() => props.onClick && props.onClick(modelName)}>
            {modelName}
          </a>
        </>
      ),
    },
  ];

  const nonFixedColumns = [
    {
      title: 'Latest Model',
      dataIndex: 'host',
      key: 'host',
      sorter: (a, b) => a.host.localeCompare(b.host),
    },
    {
      title: 'Staging Model',
      dataIndex: 'port',
      key: 'port',
      sorter: (a, b) => a.port - b.port,
    },
    {
      title: 'Production Model',
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
        dataSource={props.models}
        columns={[...fixedColumns, ...nonFixedColumns]}
      />
    </>
  );
});
