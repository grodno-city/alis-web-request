import { readFile } from 'fs/promises';

export const readFixture = (name) => {
  return readFile(new URL(`./fixtures/${name}.html`, import.meta.url), { encoding: 'utf-8' });
};
