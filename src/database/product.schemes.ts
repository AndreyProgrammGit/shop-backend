import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IProducts {
  name: string;
  productId: number;
  count: number;
  price: number;
  desc: string;
  category: string;
  brand: string;
}

@Schema()
export class Product implements IProducts {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true })
  brand: string;
  @Prop({ type: String, required: true })
  category: string;
  @Prop({ type: Number, required: true })
  productId: number;
  @Prop({ type: Number, required: true })
  count: number;
  @Prop({ type: Number, required: true })
  price: number;
  @Prop({ type: String, required: true })
  desc: string;
}

export const ProductSchemes = SchemaFactory.createForClass(Product);
