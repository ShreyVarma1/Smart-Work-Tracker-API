import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type JpUserDocument = HydratedDocument<JpUser>;

@Schema({ collection: 'jp_users' })
export class JpUser {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;
}

export const JpUserSchema = SchemaFactory.createForClass(JpUser);

JpUserSchema.set('toJSON', {
  transform: (_doc: any, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
