import fs from 'fs-extra';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const filterFunc = (src: string, _dest: string) => {
  const excludeExtensions = ['.md', '.example'];
  const ext = path.extname(src);
  return !excludeExtensions.includes(ext);
};

fs.copySync('keys', 'build/keys', { filter: filterFunc });
