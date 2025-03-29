import {
  Controller,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
import { APP, INVENTORY_REQUESTS, } from '@app/common/constants/events';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  PaginationDto,
} from '@app/common/dto/create-user.dto';

@Controller('/inventory')
export class InventoryController {
  constructor(
    @Inject(APP.INVENTORY_SERVICE) private readonly inventoryClient: ClientProxy, // Injecting the ClientProxy
  ) {}

  @Get()
  async get(@Query() paginationDto: PaginationDto) {
    try {
      const inventories = await firstValueFrom(
        this.inventoryClient.send(INVENTORY_REQUESTS.GET_INVENTORY, paginationDto),
      );

      return inventories;
    } catch (error) {
      console.error('Error fetching inventories', error);
      throw error; // Handle errors appropriately
    }
  }

}
