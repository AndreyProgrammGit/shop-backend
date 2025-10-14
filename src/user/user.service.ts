import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, IUser } from 'src/database/user.schemas';
import type { IRegisterDTO } from 'src/auth/types/Dtos';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userSchema: Model<IUser>) {}

  async create(dto: IRegisterDTO): Promise<IUser> {
    const user = await this.userSchema.create({ email: dto.email });
    return user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userSchema.findOne({ email }).exec();
  }
}
