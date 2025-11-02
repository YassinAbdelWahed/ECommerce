import { Types } from 'mongoose';
import { IUser } from './user.interfaces';
import { IBrand } from './brand.interface';
import { ICategory } from './category.interface';

export interface IProduct {
  _id?: Types.ObjectId;

  name: string;
  slug: string;
  description?: string;
  assetFolderId: string;
  images: string[];

  originalPrice: number;
  discountPrice: number;
  salePrice: number;

  stock: number;
  soldItems: number;

  category: Types.ObjectId | ICategory;
  brands: Types.ObjectId | IBrand;

  createdBy: Types.ObjectId | IUser;
  updatedBy?: Types.ObjectId | IUser;

  createdAt?: Date;
  updateAt?: Date;

  freezedAt?: Date;
  restoredAt?: Date;
}
