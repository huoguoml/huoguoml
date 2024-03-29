import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { MLModelRegistryInterface } from '../../../../types';
import { Table } from 'antd';
import { timestampToDate } from 'utils/time';

interface Props {
  registry: MLModelRegistryInterface[];
  onClick?: (modelName: string) => void;
}

export const ModelRegistryTable = memo((props: Props) => {
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
          <a onClick={() => props.onClick && props.onClick(`${modelName}`)}>
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
          <a
            onClick={() =>
              props.onClick &&
              props.onClick(
                `${ml_models[ml_models.length - 1]?.name}/${
                  ml_models[ml_models.length - 1]?.version
                }`,
              )
            }
          >
            {ml_models[ml_models.length - 1]?.version}
          </a>
        </>
      ),
    },
    {
      title: 'Staging Model',
      dataIndex: 'ml_models',
      key: 'staged_ml_models',
      render: ml_models => (
        <>
          <a
            onClick={() =>
              props.onClick &&
              props.onClick(
                `${ml_models.find(ml_model => ml_model.tag === 0)?.name}/${
                  ml_models.find(ml_model => ml_model.tag === 0)?.version
                }`,
              )
            }
          >
            {ml_models.find(ml_model => ml_model.tag === 0)?.version}
          </a>
        </>
      ),
    },
    {
      title: 'Production Model',
      dataIndex: 'ml_models',
      key: 'productions_ml_models',
      render: ml_models => (
        <>
          <a
            onClick={() =>
              props.onClick &&
              props.onClick(
                `${ml_models.find(ml_model => ml_model.tag === 1)?.name}/${
                  ml_models.find(ml_model => ml_model.tag === 1)?.version
                }`,
              )
            }
          >
            {ml_models.find(ml_model => ml_model.tag === 1)?.version}
          </a>
        </>
      ),
    },
    {
      title: 'Last Modification',
      dataIndex: 'ml_models',
      key: 'last_modification',
      render: ml_models => (
        <>
          <div>
            {timestampToDate(
              ml_models[ml_models.length - 1]?.last_modification,
            )}
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        size="small"
        scroll={{ x: 'max-content' }}
        dataSource={props.registry}
        columns={[...fixedColumns, ...nonFixedColumns]}
      />
    </>
  );
});
