import { Types } from 'mongoose';

export const paresObjectId = (value: string):Types.ObjectId => {
  return Types.ObjectId.createFromHexString(value as string);
};