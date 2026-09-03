import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOkResponse({
    description: 'Application is running',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2026-09-02T10:00:00.000Z',
      },
    },
  })
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
