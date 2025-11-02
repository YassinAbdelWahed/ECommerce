import { Types } from 'mongoose';
import { IUser } from './user.interfaces';

export interface IBrand {
  _id?: Types.ObjectId;

  name: string;
  slug: string;
  slogan: string;
  image: string;

  createdBy: Types.ObjectId | IUser;
  updatedBy?: Types.ObjectId | IUser;

  createdAt?: Date;
  updateAt?: Date;

  freezedAt?: Date;
  restoredAt?: Date;
}
