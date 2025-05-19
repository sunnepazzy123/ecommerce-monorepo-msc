import { Injectable } from '@nestjs/common';
import {
  PaginationDto,
} from '@app/common/dto/create-user.dto';
import { RpcException } from '@nestjs/microservices';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from '@app/common/dto/products.dto';

@Injectable()
export class ProductService {

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) { }


  async getProducts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    try {
      const users = await this.productModel.find().skip(skip).limit(limit);
      const total = await this.productModel.countDocuments();
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
        message: 'An unexpected error occurred while fetching the users',
      });
    }
  }


  async getProduct(id: Types.ObjectId) {
    try {
      const product = await this.productModel.findById(id);

      if (!product) {
        throw new RpcException({
          status: 404,
          message: `product with ID ${id} not found`,
        });
      }

      return product;
    } catch (error) {
      if (error instanceof RpcException) {
        throw error; // Re-throw existing RpcException
      }

      throw new RpcException({
        status: 500,
        message: 'An unexpected error occurred while fetching single products',
      });
    }
  }

  async createPost(payload: CreateProductDto) {
    try {
      const product = this.productModel.create(payload)
      return product
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: 500,
        message: 'An unexpected error occurred while creating the products',
      });
    }
  }
}
