import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type ObjectId, SchemaTypes } from 'mongoose';

export interface ITokens {
  userId: ObjectId;
  accessToken: string;
  refreshToken: string;
}

@Schema()
export class Tokens implements ITokens {
  @Prop({ type: SchemaTypes.ObjectId, require: true, unique: true })
  userId: ObjectId;
  @Prop({ required: true, unique: true })
  accessToken: string;
  @Prop({ required: true, unique: true })
  refreshToken: string;
}

export const TokensSchema = SchemaFactory.createForClass(Tokens);
