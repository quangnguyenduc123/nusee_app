import { LoggerService } from '@nestjs/common';
import pino from 'pino';

export class PinoLoggerService implements LoggerService {
  private readonly logger;

  constructor() {
    this.logger = pino({
      level: 'info',
      transport: {
        target: 'pino-pretty',
      },
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error({ msg: message, trace });
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
