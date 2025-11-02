import { exit } from 'node:process';


import { Application } from "./app.js";

const app = new Application();

app.init().catch(error => {
  console.error('Failed init app: ', error);
  exit(1);
})