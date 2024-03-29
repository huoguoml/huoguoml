import * as React from 'react';
import { memo } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface Props {
  value: string;
}

export const MarkdownPreview = memo((props: Props) => {
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={github}
          language={match[1]}
          PreTag="div"
          children={String(children).replace(/\n$/, '')}
          {...props}
        />
      ) : (
        <SyntaxHighlighter
          style={github}
          language={'bash'}
          PreTag="div"
          children={String(children).replace(/\n$/, '')}
          {...props}
        />
      );
    },
  };

  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        //@ts-ignore
        components={components}
      >
        {props.value}
      </ReactMarkdown>
    </>
  );
});
