import mongoose, { Document, Schema } from 'mongoose';

export interface IMeasurement {
  date: Date;
  weight: number;
  height: number;
  z_score: number;
  status: 'NORMAL' | 'RISK' | 'STUNTED' | 'SEVERELY_STUNTED';
}

export interface IPatient extends Document {
  posyandu_id: mongoose.Types.ObjectId;
  name: string;
  dob: Date;
  gender: 'MALE' | 'FEMALE';
  measurements: IMeasurement[];
  created_at: Date;
}

const MeasurementSchema = new Schema({
  date: { type: Date, default: Date.now },
  weight: Number,
  height: Number,
  z_score: Number,
  status: {
    type: String,
    enum: ['NORMAL', 'RISK', 'STUNTED', 'SEVERELY_STUNTED']
  }
});

const PatientSchema: Schema = new Schema({
  posyandu_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE'],
    required: true
  },
  measurements: [MeasurementSchema],
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IPatient>('Patient', PatientSchema);
