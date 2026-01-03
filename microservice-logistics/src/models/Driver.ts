import mongoose, { Document, Schema } from 'mongoose';

export interface IDriver extends Document {
  provider_id: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  vehicle_number: string;
  status: 'AVAILABLE' | 'ON_DELIVERY' | 'OFF_DUTY';
  current_shipment_id?: mongoose.Types.ObjectId; // Lock to a shipment if BUSY
  created_at: Date;
}

const DriverSchema: Schema = new Schema({
  provider_id: { type: Schema.Types.ObjectId, ref: 'LogisticsProvider', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  vehicle_number: { type: String, required: true },
  status: {
    type: String,
    enum: ['AVAILABLE', 'ON_DELIVERY', 'OFF_DUTY'],
    default: 'AVAILABLE'
  },
  current_shipment_id: { type: Schema.Types.ObjectId, ref: 'Shipment' },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IDriver>('Driver', DriverSchema);
