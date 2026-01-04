import mongoose, { Document, Schema } from 'mongoose';

export interface IIntervention extends Document {
  posyandu_id: mongoose.Types.ObjectId;
  patient_id: mongoose.Types.ObjectId;
  request_id: string; // ID unik yang sama dengan di Logistics
  status: 'PENDING' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED';
  urgency: string;
  driver_name?: string;
  driver_phone?: string;
  eta?: string;
  shipped_at?: Date;
  created_at: Date;
  updated_at: Date;
}

const InterventionSchema: Schema = new Schema({
  posyandu_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  patient_id: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  request_id: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  },
  urgency: { type: String, default: 'HIGH' },
  driver_name: { type: String },
  driver_phone: { type: String },
  eta: { type: String },
  shipped_at: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IIntervention>('Intervention', InterventionSchema);
