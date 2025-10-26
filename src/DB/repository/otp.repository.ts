import { Injectable } from '@nestjs/common';
import { Otp, OtpDocument as TDocument } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { DatabaseRepository } from './database.repository';
import { Model } from 'mongoose';

@Injectable()
export class OtpRepository extends DatabaseRepository<Otp> {
  constructor(
    @InjectModel(Otp.name) 
    protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}