import os from 'node:os';

export const osInfo = async (app, flag) => {
  try {
    switch (flag) {
      case '--EOL':
        console.log(JSON.stringify(os.EOL));
        break;
      case '--cpus':
        const cpus = os.cpus();
        console.log('cpus total count!: ', cpus.length);
        cpus.forEach((cpu, index) => {
          console.log(`cpu ${index + 1}: ${cpu.model.trim()}, speed: ${cpu.speed/1000}`);
        });
        break;
      case '--homedir':
        console.log(os.homedir());
        break;
      case '--username':
        console.log(os.userInfo().username);
        break;
      case '--architecture':
        console.log(os.arch());
        break;
      default:
        console.log('Invalid input');
    }
    
  } catch (error) {
    console.log('Operation failed', error);
  }
};