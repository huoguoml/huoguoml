import * as React from 'react';
import { memo } from 'react';
interface Props {
  children: React.ReactNode;
}

export const ContentCard = memo((props: Props) => {
  return (
    <>
      <div
        className="site-layout-background"
        // top, right, bottom, left
        style={{ padding: 24, margin: 16 }}
      >
        {props.children}
      </div>
    </>
  );
});
