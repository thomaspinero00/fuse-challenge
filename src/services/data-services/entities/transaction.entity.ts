import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

export enum TRANSACTION_STATUSES {
  FAILED = 'FAILED',
  SUCCESSFUL = 'SUCCESSFUL',
}

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: String, required: true })
  symbol: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: String, enum: Object.values(TRANSACTION_STATUSES), required: true })
  status: TRANSACTION_STATUSES;

  @Prop({ type: String, required: false })
  failureReason?: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;
  createdAt: string | number | Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
