import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export interface IUser {
  _id: ObjectId;
  email: string;
  name: string;
  surname: string;
  city: string;
  old: number;
}

@Schema()
export class User implements IUser {
  _id: ObjectId;
  @Prop({ required: true, unique: false })
  name: string;
  @Prop({ required: true, unique: false })
  surname: string;
  @Prop({ required: false, unique: false })
  city: string;
  @Prop({ required: true, unique: false })
  old: number;
  @Prop({ required: true, unique: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
