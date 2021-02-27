import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ExperimentInterface } from '../../../types';

interface Props {
  experiments: ExperimentInterface[];
}

export const ExperimentTable = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  return (
    <>
      <p>hi</p>
    </>
  );
});
