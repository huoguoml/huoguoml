import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModelComparePageSlice } from './slice';
import { selectModelComparePageState } from './slice/selectors';
import { useParams } from 'react-router-dom';
import { Button, Select, Space, Typography } from 'antd';
import { ContentCardsLayout } from '../../layout/ContentCardsLayout/Loadable';
import { ArrowLeftOutlined } from '@ant-design/icons';

export function ModelComparePage() {
  const { Option } = Select;
  const { Title } = Typography;

  const { mlModelName, baseModel, compareModel } = useParams<
    Record<string, string>
  >();

  const dispatch = useDispatch();
  const { actions } = useModelComparePageSlice();
  const modelComparePageState = useSelector(selectModelComparePageState);

  // React.useEffect(() => {
  //   dispatch(actions.getModelCompareState(`${mlModelName}`));
  // }, [dispatch, mlModelName, actions]);

  return (
    <>
      <ContentCardsLayout
        contentUri={[
          'models',
          mlModelName,
          'compare',
          `${baseModel}...${compareModel}`,
        ]}
        skipUri={['compare']}
      >
        <Title level={1}>Compare models</Title>

        <Space>
          <Select defaultValue="lucy" style={{ width: 120 }}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
          <ArrowLeftOutlined />
          <Select defaultValue="lucy" style={{ width: 120 }}>
            <Option value="0">None</Option>
            <Option value="1">Staging</Option>
            <Option value="2">Production</Option>
          </Select>
        </Space>

        <Button>Change stage</Button>
      </ContentCardsLayout>
    </>
  );
}
