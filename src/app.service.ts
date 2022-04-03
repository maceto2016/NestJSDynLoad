import { Logger, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IModuleDynLoaderEvent,
  EV_MODULE_DYN_LOADER,
} from './common/module-loader-defs';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  @OnEvent(EV_MODULE_DYN_LOADER + '*', { async: true })
  /**
   * Get notifield when modules are loaded
   */
  async handleOnEventLoad(payload: IModuleDynLoaderEvent) {
    if (payload.error) {
      this.logger.log(`**Modules load ERROR: "${payload.error}" **`);
    } else {
      this.logger.log(
        `**Modules sucessfully loaded: "${
          payload.name
        } => (${payload.moduleNames.toString()})" **`,
      );
    }
  }
}
