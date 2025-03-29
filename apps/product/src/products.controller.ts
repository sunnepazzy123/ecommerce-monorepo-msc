import { APP, PRODUCT_REQUESTS } from '@app/common/constants/events';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  PaginationDto,
} from '@app/common/dto/create-user.dto';
import { HealthCheckService } from './health/health-check.service';
import { ProductService } from './products.service';

@Controller()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly healthCheckService: HealthCheckService,
  ) {}

  @MessagePattern(PRODUCT_REQUESTS.GET_PRODUCTS)
  async getProducts(@Payload() query: PaginationDto) {
    const products = this.productService.getProducts(query);
    return products;
  }



  @MessagePattern(APP.PRODUCT_SERVICE)
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
