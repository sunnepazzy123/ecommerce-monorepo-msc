import { Module } from '@nestjs/common';
import { RmqModule, RmqService } from '@app/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { APP } from '@app/common/constants/events';
import { UsersController } from './controllers/users.controller';
import { getEnvironment } from '@app/common/constants/config';
import { MiddlewareModule } from '@app/common/middlewares/middleware.module';
import { HealthModule } from './health.module';
import { LoggerService } from '@app/common/helpers/logger.service';
import { ProductController } from './controllers/product.controller';
import { InventoryController } from './controllers/inventory.controller';

const serviceAppNames = [
  APP.AUTH_SERVICE,
  APP.NOTIFICATION_SERVICE,
  APP.PRODUCT_SERVICE,
  APP.INVENTORY_SERVICE


  // Add more services here as needed
];

const createRmqModules = (moduleNames: string[]) => {
  return moduleNames.map((serviceName) => RmqModule.register({name: serviceName}));
};

@Module({
  imports: [
    ...createRmqModules(serviceAppNames),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
      envFilePath: `./apps/api-gateway/.env.${getEnvironment()}`,
    }),
    MiddlewareModule,
    HealthModule,
  ],
  controllers: [UsersController, ProductController, InventoryController],
  providers: [
    RmqService,
    LoggerService
  ],
})
export class ApiGatewayModule { 
}
