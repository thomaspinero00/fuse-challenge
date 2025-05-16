import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PortfolioDocument = HydratedDocument<Portfolio>;

@Schema({ timestamps: true })
export class StocksSchema {
  @Prop({ type: String, required: true }) symbol: string;
  @Prop({ type: Number, required: true }) quantity: number;
  @Prop({ type: Number, required: true }) lastPurchasePrice: number;
}



@Schema({ timestamps: true })
export class Portfolio {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;

  @Prop({ type: [StocksSchema], default: [] })
  stocks: StocksSchema[];
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);

PortfolioSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
