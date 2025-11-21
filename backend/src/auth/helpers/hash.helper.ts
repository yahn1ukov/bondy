import { Injectable } from '@nestjs/common';

import * as argon2 from 'argon2';

@Injectable()
export class HashHelper {
  async hash(value: string): Promise<string> {
    return argon2.hash(value);
  }

  async verify(hash: string, value: string): Promise<boolean> {
    return argon2.verify(hash, value);
  }
}
