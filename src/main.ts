import { App } from './app';

function main() {
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  const app = new App(canvas);
  app.draw();
}

main();
