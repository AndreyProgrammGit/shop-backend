import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IProduct {
  productId: string;
  name: string;
  count: number;
  price: number;
  desc: string;
  category: string;
  brand: string;
}

@Schema()
export class Product implements IProduct {
  @Prop({ type: String, required: true, default: () => uuidv4() })
  productId: string;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true })
  brand: string;
  @Prop({ type: String, required: true })
  category: string;
  @Prop({ type: Number, required: true })
  count: number;
  @Prop({ type: Number, required: true })
  price: number;
  @Prop({ type: String, required: true })
  desc: string;
}

export const ProductSchemes = SchemaFactory.createForClass(Product);
