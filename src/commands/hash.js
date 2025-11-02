import { resolve } from 'node:path';
import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { stat } from 'node:fs/promises';

const ALGORITHM = 'sha256';

export const hash = async (app, path) => {
  try {
    if (!path) {
      console.log('Invalid input');
      return;
    }
    
    const filePath = resolve(app.currentDir, path);
    const stats = await stat(filePath);

    if (!stats.isFile()) {
      console.log('Invalid input');
      return;
    }

    const hash = createHash(ALGORITHM);
    const stream = createReadStream(filePath);

    await new Promise((resolve, reject) => {
  
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => {
        const hexData = hash.digest('hex');
        console.log(hexData);
        resolve();
      });
      stream.on('error', () => {
        console.log('Operation failed');
        reject();
      });
    });
        
  } catch (error) {
    console.error('Operation failed');
  }
}