import mongoose, { Document, Schema } from 'mongoose';

export interface IPosyanduRegistry extends Document {
  health_posyandu_id: string;
  name: string;
  address?: string;
  location: {
    type: 'Point';
    coordinates: number[]; // [lng, lat]
  };
  assigned_hub_id?: mongoose.Types.ObjectId;
  last_synced_at: Date;
}

const PosyanduRegistrySchema: Schema = new Schema({
  health_posyandu_id: {
    type: String,
    required: true,
    unique: true, // One shadow entry per real posyandu
    index: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ''
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
  assigned_hub_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LogisticsProvider',
    default: null
  },
  last_synced_at: {
    type: Date,
    default: Date.now
  }
});

// Create 2dsphere index for geospatial queries
PosyanduRegistrySchema.index({ location: '2dsphere' });

export default mongoose.model<IPosyanduRegistry>('PosyanduRegistry', PosyanduRegistrySchema);
