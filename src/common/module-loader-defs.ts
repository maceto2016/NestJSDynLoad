import { ModuleRef } from '@nestjs/core';

/**
 * Constants used in ModuleLoader implementation
 */
export const MODULE_LOADER_OPTIONS = 'MODULE_LOADER_OPTIONS';
export const MODULE_LOADER_NAMES = 'MODULE_LOADER_NAMES';
export const MODULE_LOADER = 'MODULE_LOADER';
export const EV_MODULE_DYN_LOADER = 'EV_MODULE_DYN_LOADER.';

/**
 * Options interface for ModuleLoaderModule.register
 */
export interface IModuleLoaderOptions {
  /**
   * Name of modules
   */
  name: string;
  /**
   * Path's modules to load
   */
  path: string;
  /**
   * Depth to search modules inside of directories's path
   * default: -1 (INFINITY) - searches in root path only
   */
  depht?: number;
  /**
   * File spec to match - accepts globs and list of globs/file names
   * default: '*.module.ts'
   */
  fileSpec?: string | Array<string>;
  /**
   * File spec to ignore - accepts globs and list of globs/file names
   */
  ignoreSpec?: string | Array<string>;
}

/**
 * Event type fired when modules are loaded
 */
export interface IModuleDynLoaderEvent {
  name: string;
  moduleNames?: Array<string>;
  error?: Error | string;
}
