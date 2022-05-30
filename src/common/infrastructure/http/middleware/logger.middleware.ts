import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('StarterService');
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body.operationName !== 'IntrospectionQuery') {
      res.on('finish', () => {
        if (res.statusCode < 200 || res.statusCode > 299) {
          this.logger.error(
            `${req.method}  ${req.originalUrl} ${req.body.query ?? ''} ${
              res.statusCode
            }`,
          );
        } else {
          this.logger.log(
            `${req.method}  ${req.originalUrl} ${req.body.query ?? ''} ${
              res.statusCode
            }`,
          );
        }
      });
    }
    next();
  }
}
