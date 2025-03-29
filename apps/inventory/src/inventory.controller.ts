import { APP, INVENTORY_REQUESTS } from '@app/common/constants/events';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  PaginationDto,
} from '@app/common/dto/create-user.dto';
import { HealthCheckService } from './health/health-check.service';
import { InventoryService } from './inventory.service';

@Controller()
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly healthCheckService: HealthCheckService,
  ) {}

  @MessagePattern(INVENTORY_REQUESTS.GET_INVENTORY)
  async getInventories(@Payload() query: PaginationDto) {
    const inventories = this.inventoryService.get(query);
    return inventories;
  }



  @MessagePattern(APP.INVENTORY_SERVICE)
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
