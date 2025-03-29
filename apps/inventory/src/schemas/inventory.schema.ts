import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Inventory extends Document {
  @Prop({ required: true, unique: true })
  productId: string; // References the product stored in Product Service

  @Prop({ required: true, default: 0 })
  availableStock: number; // Number of items available for purchase

  @Prop({ required: true, default: 0 })
  reservedStock: number; // Stock reserved for orders to prevent overselling

  @Prop()
  warehouseLocation?: string; // Optional field for multi-warehouse systems

  @Prop({ type: Date, default: Date.now })
  lastUpdated: Date; // Timestamp of the last inventory update
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
