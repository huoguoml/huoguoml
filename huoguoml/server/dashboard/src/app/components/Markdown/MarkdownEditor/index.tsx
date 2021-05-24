import * as React from 'react';
import { memo } from 'react';
import { Button, Input } from 'antd';
import 'katex/dist/katex.min.css';
import { MarkdownPreview } from '../MarkdownPreview/Loadable';

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

  return (
    <>
      <MarkdownPreview value={props.value} />

      {edit ? (
        <>
          <TextArea
            value={props.value}
            autoSize={true}
            showCount
            onChange={value =>
              props.onChange && props.onChange(value.target.value)
            }
            placeholder={props.placeholder}
          />
          <Button type="primary" onClick={() => setEdit(false)}>
            Cancel
          </Button>
          <Button type="primary" onClick={() => handleSave()}>
            Save
          </Button>
        </>
      ) : (
        <Button type="primary" onClick={() => setEdit(true)}>
          Edit
        </Button>
      )}
    </>
  );
});
