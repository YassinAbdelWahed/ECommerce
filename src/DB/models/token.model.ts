import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Token {
  @Prop({ type: String, required: true, unique: true })
  jti: string;

  @Prop({ type: Date, required: true })
  expiredAt: Date;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  createdBy: Types.ObjectId;
}

export type TokenDocument = HydratedDocument<Token>;
const tokenSchema = SchemaFactory.createForClass(Token);
tokenSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
export const TokenModel = MongooseModule.forFeature([
  {
    name: Token.name,
    schema: tokenSchema,
  },
]);