import * as React from 'react';
import { memo } from 'react';
import { Button, Col, Input, Row, Space, Typography } from 'antd';
import { MarkdownPreview } from '../MarkdownPreview/Loadable';
import { EditOutlined } from '@ant-design/icons';
import { StatusTag } from '../StatusTag/Loadable';
import { RegisterModelButton } from '../buttons/RegisterModelButton/Loadable';

interface Props {
  value: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder: string;
}

export const MarkdownEditor = memo((props: Props) => {
  const { TextArea } = Input;

  const [edit, setEdit] = React.useState<boolean>(false);

  const handleSave = () => {
    setEdit(false);
    props.onSubmit && props.onSubmit(props.value);
  };
  const { Title } = Typography;

  return (
    <>
      <Row justify={'space-between'} align={'top'}>
        <Col>
          <Title level={3}>Description</Title>
        </Col>
        <Col>
          {edit ? (
            <Space>
              <Button onClick={() => setEdit(false)}>Cancel</Button>
              <Button type="primary" onClick={() => handleSave()}>
                Save
              </Button>
            </Space>
          ) : (
            <Button type="primary" onClick={() => setEdit(true)}>
              Edit
            </Button>
          )}
        </Col>
      </Row>

      {edit ? (
        <TextArea
          value={props.value}
          autoSize={true}
          showCount
          onChange={value =>
            props.onChange && props.onChange(value.target.value)
          }
          placeholder={props.placeholder}
        />
      ) : (
        <MarkdownPreview value={props.value} />
      )}
    </>
  );
});
