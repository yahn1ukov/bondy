import { Module } from '@nestjs/common';

import { CookieHelper } from './helpers/cookie.helper';
import { HashHelper } from './helpers/hash.helper';

@Module({
  providers: [CookieHelper, HashHelper],
  exports: [CookieHelper, HashHelper],
})
export class CommonModule {}
