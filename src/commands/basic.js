import { error } from "node:console";
import { createReadStream, createWriteStream } from "node:fs";
import { writeFile, mkdir, rename, rm } from "node:fs/promises";
import { resolve, basename, dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";

export const cat = async (app, filePath) => {
  try {
    if (!filePath) {
      console.log('Invalid input');
      return;
    }

    const path = resolve(app.curentDir, filePath);
    const stream = createReadStream(path, { encoding: 'utf8' });

    stream.on('data', chunk => {
      process.stdout.write(chunk);
    });

    stream.on('end', () => {
      process.stdout.write('\n');
    });
    stream.on('error', () => {
      console.log('Operation failed');
    });

  } catch (error) {
    console.error('Operation failed');
  }
}

export const add = async (app, fileName) => {
  try {
    if (!fileName) {
      console.log('Invalid input');
      return;
    }

    const path = resolve(app.currentDir, fileName);
    await writeFile(path, '', { flag: 'wx' });
    
  } catch (error) {
    console.error('Operation failed');
  }
}

export const makeDir = async (app, dirName) => {
  try {
    if (!dirName) {
      console.log('Invalid input');
      return;
    }

    const path = resolve(app.currentDir, dirName);
    await mkdir(path, { recursive: false });
    
  } catch (error) {
    console.error('Operation failed');
  }
};

export const rn = async (app, filePath, newFileName) => {
  try {
    if (!filePath || !newFileName) {
      console.log('Invalid input');
      return;
    }
    const path = resolve(app.currentDir, filePath);
    const newPath = resolve(dirname(path), newFileName);

    await rename(path, newPath);
  } catch (error) {
    console.error('Operation failed');
  }
};

export const cp = async (app, filePath, destDir) => {
  try {
    if (!filePath || !destDir) {
      console.log('Invalid input');
      return;
    }

    const sourcePath = resolve(app.currentDir, filePath);
    const targetDir = resolve(app.currentDir, destDir);
    const fileName = basename(sourcePath);
    const destPath = join(targetDir, fileName);

    const source = createReadStream(sourcePath);
    const destination = createWriteStream(destPath, { flags: 'wx' });

    await pipeline(source, destination);

  } catch {
    console.error('Operation failed', JSON.stringify(error));
  }
};

export const mv = async (app, filePath, destDir) => {
  try {
    if (!filePath || !destDir) {
      console.log('Invalid input');
      return;
    } 

    await cp(app, filePath, destDir);
    await rmFile(app, filePath);
  } catch (error) {
    console.error('Operation failed');
  }
}

export const rmFile = async (app, filePath) => {
  try {
    if (!filePath) {
      console.log('Invalid input');
      return;
    }   

    const path = resolve(app.currentDir, filePath);
    await rm(path);

  } catch (error) {
    console.error('Operation failed');
  }
}