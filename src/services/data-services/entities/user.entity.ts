import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Portfolio', required: false })
  portfolio: mongoose.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
