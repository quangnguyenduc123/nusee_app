import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

class CustomHealthIndicator extends HealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = true;
    const result = this.getStatus(key, isHealthy, { message: 'ping OK' });
    return result;
  }
}

@Controller('health')
export class HealthController {
  private customHealthIndicator: CustomHealthIndicator;
  constructor(private health: HealthCheckService) {
    this.customHealthIndicator = new CustomHealthIndicator();
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () => this.customHealthIndicator.isHealthy('custom'),
    ]);
  }
}
