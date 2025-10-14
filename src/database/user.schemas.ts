import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export interface IUser {
  _id: ObjectId;
  email: string;
}

@Schema()
export class User implements IUser {
  _id: ObjectId;

  @Prop({ required: true, unique: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
