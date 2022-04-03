import { Logger, Module, DynamicModule } from '@nestjs/common';
import * as fb from 'fast-glob';
import * as path from 'path';
import { ModuleLoaderService } from './module-loader.service';
import {
  MODULE_LOADER,
  MODULE_LOADER_OPTIONS,
  MODULE_LOADER_NAMES,
  IModuleLoaderOptions,
} from './module-loader-defs';

export const moduleLoaderFactory = {
  provide: MODULE_LOADER,
  useFactory: (moduleLoaderService: ModuleLoaderService) => {},
  inject: [ModuleLoaderService],
};

interface IModuleInfo {
  name: string;
  module: DynamicModule;
}

/**
 * @description helper static class to load modules dynamically.
 */
class InternalModuleLoader {
  static readonly logger = new Logger(InternalModuleLoader.name);

  /**
   * @param _options for GLOB searches
   * @returns a Promise thats resolves to a list of name and module references based on _options filespec
   */
  static async loadModules(
    _options: IModuleLoaderOptions,
  ): Promise<Array<IModuleInfo>> {
    return new Promise((resolve, reject) => {
      this.getModuleFileNames(_options).then((filePaths: Array<string>) => {
        if (filePaths.length == 0) {
          resolve([]);
        } else {
          const loadedModules: Array<Promise<any>> = filePaths.map((filePath) =>
            this.loadModule(filePath),
          );
          if (loadedModules.length === 0) {
            resolve([]);
          } else {
            const moduleInfos: Array<IModuleInfo> = new Array();
            Promise.all(loadedModules).then((modules: Array<any>) => {
              for (let i = 0; i < modules.length; i++) {
                let module = modules[i];
                const moduleField = Object.keys(module).find(
                  (key) => key.indexOf('Module') >= 0,
                );
                if (moduleField) {
                  moduleInfos.push({
                    name: moduleField,
                    module: module[moduleField],
                  });
                }
              }
              resolve(moduleInfos);
            });
          }
        }
      });
    });
  }

  /**
   * @description Uses native import() to dynamicly load a module
   * @param modulePath
   * @returns a Promise thats resolves to module loaded
   */
  private static async loadModule(modulePath: string): Promise<any> {
    return import(modulePath);
  }

  /**
   * @description Uses FatsGlob to load the filenames for the modules
   * @param _options for GLOB searches
   * @returns a list of module's file paths
   */
  private static async getModuleFileNames(
    _options: IModuleLoaderOptions,
  ): Promise<Array<string>> {
    const spec: Array<string> = (
      typeof _options.fileSpec === 'string'
        ? [_options.fileSpec]
        : _options.fileSpec
    ).map((fileSpec) => path.join(_options.path, fileSpec));
    let options: fb.Options = {
      onlyFiles: true,
    };
    if (_options.depht) {
      options.deep = _options.depht < 0 ? Infinity : _options.depht;
    }
    if (_options.ignoreSpec) {
      options.ignore = Array.isArray(_options.ignoreSpec)
        ? _options.ignoreSpec
        : [_options.ignoreSpec];
    }
    this.logger.log(`**Module Loader FileSpec**: "${spec}"`);

    return fb(spec, options);
  }
}

@Module({})
export class ModuleLoaderModule {
  /**
   * @description Load Modules dynamically via GLOBs and native import() function.
   * @param moduleLoaderOptions options for GLOB searches
   */
  public static async register(
    moduleLoaderOptions: IModuleLoaderOptions,
  ): Promise<DynamicModule> {
    const moduleInfos = await InternalModuleLoader.loadModules(
      moduleLoaderOptions,
    );
    const modules = moduleInfos.map((moduleInfo) => moduleInfo.module);
    const moduleNames = moduleInfos.map((moduleInfo) => moduleInfo.name);

    return {
      module: ModuleLoaderModule,
      imports: [...modules],
      providers: [
        {
          provide: MODULE_LOADER_OPTIONS,
          useValue: moduleLoaderOptions,
        },
        {
          provide: MODULE_LOADER_NAMES,
          useValue: moduleNames,
        },
        ModuleLoaderService,
        moduleLoaderFactory,
      ],
    };
  }
}
