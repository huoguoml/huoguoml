import * as React from 'react';
import { memo } from 'react';
import { Button, Dropdown, Menu } from 'antd';

interface Props {}

export const LanguageButton = memo((props: Props) => {
  const [language, setLanguage] = React.useState('English');
  const menu = (
    <Menu>
      <Menu.Item onClick={() => setLanguage('German')}>German</Menu.Item>
      <Menu.Item onClick={() => setLanguage('Chinese')}>Chinese</Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} placement="bottomCenter">
        <Button>{language}</Button>
      </Dropdown>
    </>
  );
});
