import mongoose, { Document, Schema } from 'mongoose';

export interface IIntervention extends Document {
  posyandu_id: mongoose.Types.ObjectId;
  patient_id: mongoose.Types.ObjectId;
  request_id: string; // ID unik yang sama dengan di Logistics
  status: 'PENDING' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED';
  urgency: string;
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
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IIntervention>('Intervention', InterventionSchema);
