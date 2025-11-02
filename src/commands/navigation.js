import { dirname, resolve } from "node:path";
import { parse } from "node:path";
import { cwd, chdir } from "node:process";
import { stat, readdir } from "node:fs/promises";

export const up = async (app) => {
  try {
    const currentDir = app.currentDir;
    const rootDir = parse(currentDir).root;
    if (currentDir === rootDir) {
      return;
    }

    const parentDir = dirname(currentDir);
    chdir(parentDir);
    app.currentDir = parentDir;

  } catch (error) {
    console.log('Operation failed');
  }
}

export const cd = async (app, dirPath) => {
  try {
    // console.log('cd CHCECK: ', app, dirPath);
    const newPath = resolve(app.currentDir, dirPath);
    const stats = await stat(newPath);

    if (!stats.isDirectory()) {
      console.log('Invalid input');
      return;
    }
    chdir(newPath);
    app.currentDir = newPath;

  } catch (error) {
    console.log('Operation failed');
  }
}

export const ls = async (app) => {
  try {
    const items = await readdir(app.currentDir, { withFileTypes: true });
    const details = items.map(item => {
      return {
        Name: item.name,
        Type: item.isDirectory() ? 'directory' : 'file'
      };
    });
    details.sort((a, b) => {
      if (a.Type === b.Type) {
        return a.Name.localeCompare(b.Name);
      }
      return a.Type === 'directory' ? -1 : 1;
    });
    console.table(details);
    
  } catch (error) {
    console.log('Operation failed');
  }
}