import { RunInterface } from '../types';

export const capitalize = (word: string) => {
  return word ? word.charAt(0).toUpperCase() + word.toLowerCase().slice(1) : '';
};

export const getUniqueKeys = (runs: RunInterface[], field_name: string) => {
  const record_keys = runs.flatMap(run => Object.keys(run[field_name]));
  return Array.from(new Set(record_keys));
};

export const modelTagToString = (tag: number | undefined) => {
  if (tag === 0) {
    return 'staging';
  } else if (tag === 1) {
    return 'production';
  } else if (tag === -1) {
    return 'none';
  } else {
    return '';
  }
};

export const modelTagToNumber = (tag: string) => {
  if (tag === 'staging') {
    return 0;
  } else if (tag === 'production') {
    return 1;
  } else {
    return -1;
  }
};
