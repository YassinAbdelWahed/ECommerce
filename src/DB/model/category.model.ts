import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';
import { ICategory } from 'src/common';

@Schema({ timestamps: true, strictQuery: true, strict: true })
export class Category implements ICategory {
  @Prop({
    type: String,
    required: true,
    unique: true,
    minLength: 2,
    maxlength: 25,
  })
  name: string;

  @Prop({ type: String })
  slug: string;

  @Prop({ type: String, minLength: 2, maxlength: 5000 })
  description: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: String, required: true })
  assetFolderId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  @Prop({ type: Date })
  freezedAt: Date;

  @Prop({ type: Date })
  restoredAt: Date;

  @Prop([{ type: Types.ObjectId, ref: 'Brand' }])
  brands?: Types.ObjectId[];
}

export type CategoryDocument = HydratedDocument<Category>;

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

CategorySchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  const update = this.getUpdate() as UpdateQuery<CategoryDocument>;
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

CategorySchema.pre(['find', 'findOne'], function (next) {
  const query = this.getQuery();
  if (query.paranoId === false) {
    this.setQuery({ ...query });
  } else {
    this.setQuery({ ...query, freezedAt: { $exists: false } });
  }
  next();
});

export const CategoryModel = MongooseModule.forFeature([
  { name: Category.name, schema: CategorySchema },
]);
