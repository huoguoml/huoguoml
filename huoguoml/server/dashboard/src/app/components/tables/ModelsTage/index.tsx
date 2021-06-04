import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { MLModelInterface } from '../../../../types';
import { Table } from 'antd';
import { ModelTag } from '../../ModelTag/Loadable';

interface Props {
  models: MLModelInterface[];
  onClick?: (modelName: string) => void;
}

export const ModelsTable = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const fixedColumns: any = [
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      sorter: (a, b) => a.version.localeCompare(b.version),
      fixed: 'left',
      render: version => (
        <>
          <a onClick={() => props.onClick && props.onClick(version)}>
            {version}
          </a>
        </>
      ),
    },
  ];

  const nonFixedColumns = [
    {
      title: 'Stage',
      dataIndex: 'tag',
      key: 'tag',
      sorter: (a, b) => String(a.tag).localeCompare(String(b.tag)),
      render: tag => (
        <>
          <ModelTag tag={tag} />
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        size="small"
        scroll={{ x: 'max-content' }}
        dataSource={props.models}
        columns={[...fixedColumns, ...nonFixedColumns]}
      />
    </>
  );
});
