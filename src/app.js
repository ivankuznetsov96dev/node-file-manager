import readline from "readline";
import { homedir } from "node:os";

import { COMMANDS } from "./config/commands.js";
import { getUsername } from "./utils/get-username.js";
import * as navigationCommands from './commands/navigation.js';
import * as compressCommands from './commands/compress.js';
import * as hashCommands from './commands/hash.js';
import * as basicCommands from './commands/basic.js';
import * as osCommands from './commands/system.js';

export class Application {
  constructor() {
    this.username = getUsername();
    this.currentDir = homedir();
    this.rl = null;
    this.isStarted = false;

    this.initCommandsList();
  }

  async init() {
    console.log(`Welcome to the File Manager, ${this.username}!`);
    this.printCurrentDir();

    this.isStarted = true;
    
    this.initReadline();
  }

  async inputProcess(input) {
    if (!input) return;

    try {
      const [command, ...args] = input.split(' ');
      // console.log('VALUE!L ', command, args);
      const cmd = command.toLowerCase();

      if (this.commands[cmd]) {
        await this.commands[cmd](this, ...args);
      } else {
        console.log('Invalid input');
        console.log('in inputProcess');
      }
    } catch (error) {
      console.log('Operation failed');
    }
  }

  initReadline() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.rl.on('SIGINT', () => {
      this.exit();
    });

    // this.rl.on('close', () => {
    //   this.exit();
    // });

    this.rl.on('line', async (input) => {
      // console.log('INPUT!: ', input.trim());
      const trimmedInput = input.trim();

      if (trimmedInput === '.exit') {
        this.exit();
        return;
      }

      await this.inputProcess(trimmedInput);
      this.printCurrentDir();
    })
  }

  // initCommandsList() {
  //   const allowedCommands = Object.values(COMMANDS);
  //   const initCommands = {
  //     up: navigationCommands.up,
  //     cd: navigationCommands.cd,
  //     ls: navigationCommands.ls,

  //     compress: compressCommands.compress,
  //     decompress: compressCommands.decompress
  //   }

  //   for (let commandKey in initCommands) {
  //     if (!allowedCommands.includes(commandKey)) {
  //       delete initCommands[commandKey];
  //     }
  //   }

  //   this.commands = initCommands;
  // }

  initCommandsList() {
    this.commands = {
      [COMMANDS.UP]: navigationCommands.up,
      [COMMANDS.CD]: navigationCommands.cd,
      [COMMANDS.LS]: navigationCommands.ls,

      [COMMANDS.CAT]: basicCommands.cat,
      [COMMANDS.ADD]: basicCommands.add,
      [COMMANDS.MKDIR]: basicCommands.makeDir,
      [COMMANDS.RN]: basicCommands.rn,
      [COMMANDS.CP]: basicCommands.cp,
      [COMMANDS.MV]: basicCommands.mv,
      [COMMANDS.RM]: basicCommands.rmFile,

      [COMMANDS.OS]: osCommands.osInfo,

      [COMMANDS.HASH]: hashCommands.hash,

      [COMMANDS.COMPRESS]: compressCommands.compress,
      [COMMANDS.DECOMPRESS]: compressCommands.decompress
    };
  }

  printCurrentDir() {
    console.log(`You are currently in ${this.currentDir}`);
  }

  exit() {
    console.log(`Thank you for using File Manager, ${this.username}, goodbye!`)
    this.isStarted = false;
    if (this.rl) {
      this.rl.close();
    }
    process.exit(0);
  }
}