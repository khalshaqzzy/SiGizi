import mongoose, { Document, Schema } from 'mongoose';

export interface IShipment extends Document {
  health_request_id: string;
  posyandu_id: mongoose.Types.ObjectId; // Ref to Shadow Registry
  hub_id: mongoose.Types.ObjectId;
  patient_details: {
    initials: string;
    age_months: number;
    urgency: string;
  };
  items: Array<{
    sku: string;
    qty: number;
  }>;
  driver?: {
    name: string;
    phone: string;
  };
  eta?: string;
  status: 'PENDING' | 'ASSIGNED' | 'ON_THE_WAY' | 'DELIVERED' | 'CONFIRMED' | 'CANCELLED';
  created_at: Date;
  updated_at: Date;
}

const ShipmentSchema: Schema = new Schema({
  health_request_id: { type: String, required: true, unique: true },
  posyandu_id: { type: Schema.Types.ObjectId, ref: 'PosyanduRegistry', required: true },
  hub_id: { type: Schema.Types.ObjectId, ref: 'LogisticsProvider', required: true },
  patient_details: {
    initials: String,
    age_months: Number,
    urgency: String
  },
  items: [{
    sku: String,
    qty: Number
  }],
  driver: {
    name: String,
    phone: String
  },
  eta: String,
  status: {
    type: String,
    enum: ['PENDING', 'ASSIGNED', 'ON_THE_WAY', 'DELIVERED', 'CONFIRMED', 'CANCELLED'],
    default: 'PENDING'
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IShipment>('Shipment', ShipmentSchema);
