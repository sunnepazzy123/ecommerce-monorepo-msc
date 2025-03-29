import { APP, ORDER_REQUESTS } from '@app/common/constants/events';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  PaginationDto,
} from '@app/common/dto/create-user.dto';
import { HealthCheckService } from './health/health-check.service';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly healthCheckService: HealthCheckService,
  ) {}

  @MessagePattern(ORDER_REQUESTS.GET_ORDER)
  async getInventories(@Payload() query: PaginationDto) {
    const inventories = this.orderService.get(query);
    return inventories;
  }



  @MessagePattern(APP.ORDER_SERVICE)
  async checkHealth() {
    const databaseHealthy = this.healthCheckService.checkDatabaseHealth();
    const queueHealthy = this.healthCheckService.checkQueueHealth();

    if (databaseHealthy && queueHealthy) {
      return { status: 'ok', message: 'All services are healthy!' };
    } else {
      return { status: 'error', message: 'One or more services are down' };
    }
  }

}
