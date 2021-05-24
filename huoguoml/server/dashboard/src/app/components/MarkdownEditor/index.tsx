import * as React from 'react';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Input, Button } from 'antd';

interface Props {
  value: string;
  onChange?: (value: string) => void;
  placeholder: string;
}

export const MarkdownEditor = memo((props: Props) => {
  const { TextArea } = Input;

  const [edit, setEdit] = React.useState<boolean>(false);

  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
      >
        {props.value}
      </ReactMarkdown>

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
          <Button type="primary" onClick={() => setEdit(false)}>
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
