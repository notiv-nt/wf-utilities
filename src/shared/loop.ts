import EventEmitter from 'eventemitter3';
import { log } from './log';

class Loop extends EventEmitter {
  private isRunning = false;
  private i = 0;

  tick = () => {
    if (!this.isRunning) {
      return;
    }

    this.emit('tick');

    if (this.i % 10 === 0) {
      this.emit('tick10');
    }

    this.i++;

    if (this.i > 100000) {
      this.i = 0;
    }

    setTimeout(this.tick, 16);
  };

  public start() {
    log('loop has started');
    this.isRunning = true;
    this.tick();
  }

  public stop() {
    this.isRunning = false;
  }
}

export const loop = new Loop();
