import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { APP, PRODUCT_REQUESTS, } from '@app/common/constants/events';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  PaginationDto,
} from '@app/common/dto/create-user.dto';
import { CreateProductDto } from '@app/common/dto/products.dto';

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


  @Post()
  async postProducts(@Body() body: CreateProductDto) {
    try {
      const products = await firstValueFrom(
        this.productClient.send(PRODUCT_REQUESTS.POST_PRODUCTS, body),
      );

      return products;
    } catch (error) {
      console.error('Error post products', error);
      throw error; // Handle errors appropriately
    }
  }

}
