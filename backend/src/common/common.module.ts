import { Module } from '@nestjs/common';

import { HashHelper } from './helpers/hash.helper';

@Module({
  providers: [HashHelper],
  exports: [HashHelper],
})
export class CommonModule {}
