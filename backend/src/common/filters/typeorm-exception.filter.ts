import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

import type { Response } from 'express';
import { QueryFailedError } from 'typeorm';

import type { PostgresError } from '../interfaces/postgres-error.interface';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(error: QueryFailedError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    const driverError = error.driverError;
    if (this.isPostgresError(driverError)) {
      switch (driverError.code) {
        case '23505':
          res.status(HttpStatus.CONFLICT).json({
            statusCode: HttpStatus.CONFLICT,
            message: 'This record already exists',
          });
          return;
      }
    }

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }

  private isPostgresError(err: unknown): err is PostgresError {
    return (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      typeof (err as Record<string, unknown>).code === 'string'
    );
  }
}
