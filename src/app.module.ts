import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as path from 'path';
import { AppService } from './app.service';
import { ModuleLoaderModule } from './common/module-loader.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({ wildcard: true }),
    /**
     * Load all entity unit modules in subdirectory /db/entity
     */
    ModuleLoaderModule.register({
      name: 'db-entities',
      /**
       * Make sure the path resolves to the **DIST** subdirectory, (we are no longer in TS land but JS land!)
       */
      path: path.resolve(__dirname, './db/entity'),
      fileSpec: '**/*.module.js',
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
