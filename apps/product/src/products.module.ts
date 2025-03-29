import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule, RmqModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP } from '@app/common/constants/events';
import { getEnvironment } from '@app/common/constants/config';
import { LoggerModule } from '@app/common/helpers/logger.module';
import { HealthCheckService } from './health/health-check.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductController } from './products.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        MONGODB_DB_NAME: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: `./apps/product/.env.${getEnvironment()}`,
    }),
    DatabaseModule,
    LoggerModule,
    RmqModule.register({
      name: APP.PRODUCT_SERVICE,
    }),
    RmqModule.register({
      name: APP.NOTIFICATION_SERVICE,
    }),
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ConfigService, HealthCheckService],
})
export class ProductModule {
}
