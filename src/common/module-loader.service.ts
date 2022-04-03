import { Injectable, Inject, Scope, OnModuleInit } from '@nestjs/common';
import {
  MODULE_LOADER_OPTIONS,
  MODULE_LOADER_NAMES,
  EV_MODULE_DYN_LOADER,
  IModuleLoaderOptions,
} from './module-loader-defs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { nextTick } from 'process';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class ModuleLoaderService implements OnModuleInit {
  constructor(
    @Inject(MODULE_LOADER_OPTIONS) private _options: IModuleLoaderOptions,
    @Inject(MODULE_LOADER_NAMES) private _moduleNames: Array<string>,

    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * @description Emmits as events when modules are loaded
   */
  onModuleInit() {
    nextTick(() => {
      const eventName = EV_MODULE_DYN_LOADER + this._options.name;
      this.eventEmitter.emit(eventName, {
        name: this._options.name,
        moduleNames: this._moduleNames,
      });
    });
  }
}
