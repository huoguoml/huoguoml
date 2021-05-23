import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { MLModelInterface, MLModelRegistryInterface } from '../../../../types';
import { Table } from 'antd';

interface Props {
  models?: MLModelRegistryInterface[];
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
      dataIndex: 'ml_models',
      key: 'lasted_ml_models',
      render: ml_models => (
        <>
          <div>{ml_models[ml_models.length - 1].run.id}</div>
        </>
      ),
    },
    {
      title: 'Staging Model',
      dataIndex: 'ml_models',
      key: 'staged_ml_models',
      render: ml_models => (
        <>
          <div>{ml_models.find(ml_model => ml_model.tag === 0)?.run.id}</div>
        </>
      ),
    },
    {
      title: 'Production Model',
      dataIndex: 'ml_models',
      key: 'productions_ml_models',
      render: ml_models => (
        <>
          <div>{ml_models.find(ml_model => ml_model.tag === 1)?.run.id}</div>
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
