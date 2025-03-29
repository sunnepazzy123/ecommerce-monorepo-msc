import { OrderStatus } from '@app/common/constants/events';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Order extends Document {

  @Prop({ required: true })
  userId: string; // ID of the customer placing the order

  @Prop({
    type: [
      {
        productId: { type: String, required: true }, // Product reference (stored in Product Service)
        quantity: { type: Number, required: true, min: 1 }, // Number of items ordered
        price: { type: Number, required: true }, // Price at the time of purchase
      },
    ],
    required: true,
  })
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[]; // List of ordered products

  @Prop({ type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING })
  status: OrderStatus; // Order status (pending, confirmed, shipped, etc.)

  @Prop({ required: true })
  totalAmount: number; // Total order price (sum of all items)

  @Prop({ default: false })
  isPaid: boolean; // Payment status

  @Prop({ type: Date })
  paymentDate?: Date; // Optional: Stores when payment was completed

  @Prop({ type: Date, default: Date.now })
  lastUpdated: Date; // Timestamp of last order update
}

export const OrderSchema = SchemaFactory.createForClass(Order);
