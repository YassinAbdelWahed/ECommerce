import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';
import { IProduct } from 'src/common';

@Schema({ timestamps: true, strictQuery: true, strict: true })
export class Product implements IProduct {
  @Prop({
    type: String,
    required: true,
    minLength: 2,
    maxlength: 2000,
  })
  name: string;

  @Prop({ type: String })
  slug: string;

  @Prop({ type: String, required: true })
  assetFolderId: string;

  @Prop({ type: String, minLength: 2, maxlength: 50000 })
  description: string;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  @Prop({ type: Date })
  freezedAt: Date;

  @Prop({ type: Date })
  restoredAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true })
  brands: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  discountPrice: number;

  @Prop({ type: Number, required: true })
  originalPrice: number;

  @Prop({ type: Number, required: true })
  salePrice: number;

  @Prop({ type: Number, default: 0 })
  soldItems: number;

  @Prop({ type: Number, required: true })
  stock: number;
}

export type ProductDocument = HydratedDocument<Product>;

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  next();
});

ProductSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  const update = this.getUpdate() as UpdateQuery<ProductDocument>;
  if (update.name) {
    this.setUpdate({
      ...update,
      slug: slugify(update.name, { lower: true, strict: true }),
    });
  }

  const query = this.getQuery();
  if (query.paranoId === false) {
    this.setQuery({ ...query });
  } else {
    this.setQuery({ ...query, freezedAt: { $exists: false } });
  }
  next();
});

ProductSchema.pre(['find', 'findOne'], function (next) {
  const query = this.getQuery();
  if (query.paranoId === false) {
    this.setQuery({ ...query });
  } else {
    this.setQuery({ ...query, freezedAt: { $exists: false } });
  }
  next();
});

export const ProductModel = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSchema },
]);
