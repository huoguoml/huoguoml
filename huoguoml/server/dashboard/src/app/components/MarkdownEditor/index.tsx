import * as React from 'react';
import { memo } from 'react';
import { Button, Col, Input, Row, Space, Typography } from 'antd';
import { MarkdownPreview } from '../MarkdownPreview/Loadable';

interface Props {
  value: string;
  onSubmit?: (value: string) => void;
  placeholder: string;
}

export const MarkdownEditor = memo((props: Props) => {
  const { TextArea } = Input;

  const [edit, setEdit] = React.useState<boolean>(false);
  const [description, setDescription] = React.useState<string>(props.value);

  const handleSave = () => {
    setEdit(false);
    props.onSubmit && props.onSubmit(description);
  };

  const handleCancel = () => {
    setEdit(false);
    setDescription(props.value);
  };

  const { Title } = Typography;

  return (
    <>
      <Row justify={'space-between'} align={'top'}>
        <Col>
          <Title level={2}>Description</Title>
        </Col>
        <Col>
          {edit ? (
            <Space>
              <Button onClick={() => handleCancel()}>Cancel</Button>
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
          value={description}
          autoSize={true}
          onChange={value => setDescription(value.target.value)}
          placeholder={props.placeholder}
        />
      ) : (
        <MarkdownPreview value={description} />
      )}
    </>
  );
});
