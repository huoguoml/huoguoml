import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceInterface } from '../../../../types';
import { Table } from 'antd';

interface Props {
  services?: ServiceInterface[];
  onClick?: (uri: string) => void;
}

export const ServiceTable = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const fixedColumns: any = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
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
      title: 'Rule',
      dataIndex: 'model_rule',
      key: 'model_rule',
      sorter: (a, b) => a.model_rule.localeCompare(b.model_rule),
    },
    {
      title: 'Model',
      key: 'model',
      render: service => (
        <>
          <a
            onClick={() =>
              props.onClick &&
              props.onClick(
                `/models/${service.model_name}/${service.model_version}`,
              )
            }
          >{`${service.model_name}, ${service.model_version}`}</a>
        </>
      ),
    },
  ];

  return (
    <>
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
