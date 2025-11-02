import { IResponse } from '../interfaces';

export const successResponse = <T = any>({
  data,
  message = 'Done',
  status = 200,
}: IResponse = {}): IResponse => {
  return { message, status, data };
};
