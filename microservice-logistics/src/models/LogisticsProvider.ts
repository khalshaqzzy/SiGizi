import mongoose, { Document, Schema } from 'mongoose';

export interface IInventoryItem {
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  min_stock: number;
}

export interface ILogisticsProvider extends Document {
  username: string;
  password_hash: string;
  name: string;
  address: string;
  location: {
    type: 'Point';
    coordinates: number[]; // [lng, lat]
  };
  inventory: IInventoryItem[];
  created_at: Date;
}

const InventorySchema = new Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: 'pcs' },
  min_stock: { type: Number, default: 10 }
});

const LogisticsProviderSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password_hash: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  },
  inventory: [InventorySchema],
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
LogisticsProviderSchema.index({ location: '2dsphere' });

export default mongoose.model<ILogisticsProvider>('LogisticsProvider', LogisticsProviderSchema);
