import {
  Controller,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
import { APP, PRODUCT_REQUESTS, } from '@app/common/constants/events';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  PaginationDto,
} from '@app/common/dto/create-user.dto';

@Controller('/products')
export class ProductController {
  constructor(
    @Inject(APP.PRODUCT_SERVICE) private readonly productClient: ClientProxy, // Injecting the ClientProxy
  ) {}

  @Get()
  async getProducts(@Query() paginationDto: PaginationDto) {
    try {
      const products = await firstValueFrom(
        this.productClient.send(PRODUCT_REQUESTS.GET_PRODUCTS, paginationDto),
      );

      return products;
    } catch (error) {
      console.error('Error fetching products', error);
      throw error; // Handle errors appropriately
    }
  }

}
