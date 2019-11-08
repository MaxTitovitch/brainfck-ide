import {
  BfInterpreter, BfInterpreterConfig, BfInterpreterOutputHandler, BfInterpreterStateHandler, BfExecutionState
} from './interpreter';

export class InterpreterController {
  private config: BfInterpreterConfig;
  private breakpoints: number[];
  private interpreter: BfInterpreter;
  private executionTimer;
  private timeToExecutePart = 50;
  private isRunning = false;

  constructor(
    public outputHandler: BfInterpreterOutputHandler,
    public stateHandler: BfInterpreterStateHandler
  ) {}

  public initialize(
    config: BfInterpreterConfig
  ): void {
    this.config = config;
    this.initializeInterpreterEntity();
  }

  private initializeInterpreterEntity(): void {
    if (!this.config) {
      throw new Error('The interpreter is not initialized');
    }
    if (this.isRunning) {
      clearTimeout(this.executionTimer);
      this.isRunning = false;
    }
    this.interpreter = new BfInterpreter(this.config, this.outputHandler);
  }

  public runProgram(): void {
    this.initializeInterpreterEntity();
    this.executeInParts(false);
  }

  public debugProgram(breakpointArray: number[]): void {
    this.initializeInterpreterEntity();
    this.breakpoints = breakpointArray.slice().sort();
    this.executeInParts(true);
  }

  public continueDebug(breakpointArray: number[]): void {
    this.breakpoints = breakpointArray.slice().sort();
    this.executeInParts(true);
  }

  public makeStep(): void {
    const state = this.interpreter.next();
    if (!state.finished) {
      state.paused = true;
    }
    this.stateHandler(state);
  }

  private executeInParts(debug: boolean): void {
    const startedMillis: number = Date.now();
    let state: BfExecutionState;

    this.isRunning = true;
    while (true) {
      state = this.interpreter.next(debug ? this.breakpoints : undefined);
      this.stateHandler(state);
      if (state.paused || state.finished) {
        break;
      } else if ((Date.now() - startedMillis) >= this.timeToExecutePart) {
        this.executionTimer = setTimeout(this.executeInParts.bind(this, debug), 0);
        break;
      }
    }
    if (state.finished) {
      this.isRunning = false;
    }
  }
}
