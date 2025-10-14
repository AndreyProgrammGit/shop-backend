import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, type ObjectId } from 'mongoose';

export interface IAuth {
  _id: ObjectId;
  userId: ObjectId;
  password: string;
}

@Schema()
export class Auth implements IAuth {
  _id: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true, unique: true })
  userId: ObjectId;

  @Prop({ required: true, unique: true })
  password: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
