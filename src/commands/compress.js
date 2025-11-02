import { basename, extname, join, resolve } from "node:path";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { unlink } from 'node:fs/promises';

export const compress = async (app, filePath, destinationPath) => {
  try {
    if (!filePath || !destinationPath) {
      console.log('Invalid input');
      return;
    }

    const sourcePath = resolve(app.currentDir, filePath);
    const destDir = resolve(app.currentDir, destinationPath);
    const destPath = join(destDir, `${basename(filePath)}.br`);

    const brotli = createBrotliCompress();
    const source = createReadStream(sourcePath);
    const destination = createWriteStream(destPath);

    await pipeline(source, brotli, destination);
    await unlink(sourcePath);

  } catch (error) {
    console.error('Operation failed');
  }
};

export const decompress = async (app, filePath, destinationPath) => {
  try {
    if (!filePath || !destinationPath) {
      console.log('Invalid input');
      return;
    }

    const sourcePath = resolve(app.currentDir, filePath);
    const destDir = resolve(app.currentDir, destinationPath);

    const baseName = basename(sourcePath, extname(sourcePath));
    const destPath = join(destDir, baseName);

    const brotli = createBrotliDecompress();
    const source = createReadStream(sourcePath);
    const destination = createWriteStream(destPath);

    await pipeline(source, brotli, destination);
    await unlink(sourcePath);
    
  } catch (error) {
    console.error('Operation failed');
  }
};