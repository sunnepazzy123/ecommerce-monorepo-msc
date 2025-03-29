import { Injectable } from '@nestjs/common';
import {
  PaginationDto,
} from '@app/common/dto/create-user.dto';
import { RpcException } from '@nestjs/microservices';
import { Model, } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Inventory } from './schemas/inventory.schema';

@Injectable()
export class InventoryService {

  constructor(
    @InjectModel(Inventory.name) private readonly inventoryModel: Model<Inventory>,
  ) { }

  async get(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    try {
      const users = await this.inventoryModel.find().skip(skip).limit(limit);
      const total = await this.inventoryModel.countDocuments();
      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: users,
      };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error; // Re-throw existing RpcException
      }

      throw new RpcException({
        status: 500,
        message: 'An unexpected error occurred while fetching the inventory',
      });
    }
  }

}
