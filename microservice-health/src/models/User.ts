import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password_hash: string;
  role: string;
  posyandu_details: {
    name: string;
    address: string;
    location: {
      type: 'Point';
      coordinates: number[]; // [lng, lat]
    };
  };
  created_at: Date;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['POSYANDU_ADMIN'],
    default: 'POSYANDU_ADMIN'
  },
  posyandu_details: {
    name: { type: String, required: true },
    address: { type: String, required: true },
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
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

UserSchema.index({ 'posyandu_details.location': '2dsphere' });

export default mongoose.model<IUser>('User', UserSchema);
