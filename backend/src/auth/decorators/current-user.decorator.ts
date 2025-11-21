import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';

import { ActiveUserData } from '../interfaces/active-user-data.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as ActiveUserData;

    return data ? user[data] : user;
  },
);
