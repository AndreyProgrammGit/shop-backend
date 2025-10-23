import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export interface ITelegramUser {
  _id?: ObjectId;
  telegramId: string;
  username: string;
  firstName: string;
  lastName: string;
}

@Schema()
export class TelegramUser implements ITelegramUser {
  @Prop({ required: true, unique: true })
  telegramId: string;
  @Prop({ required: true, unique: false })
  username: string;
  @Prop({ default: '', unique: false })
  firstName: string;
  @Prop({ default: '', unique: false })
  lastName: string;
}

export const TelegramUserSchema = SchemaFactory.createForClass(TelegramUser);
