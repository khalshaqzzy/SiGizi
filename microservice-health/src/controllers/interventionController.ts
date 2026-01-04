import { Request, Response } from 'express';
import Patient from '../models/Patient';
import axios from 'axios';
import User from '../models/User';
import Intervention from '../models/Intervention';

interface AuthRequest extends Request {
  user?: any;
}

const LOGISTICS_URL = process.env.LOGISTICS_URL || 'http://localhost:5002';
const SHARED_SECRET = process.env.SHARED_SECRET || 'internal_secret_123';

export const createIntervention = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { patientId, urgency } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    if (patient.posyandu_id.toString() !== req.user.id) {
        res.status(403).json({ message: 'Not authorized' });
        return;
    }

    // Get current User/Posyandu details for Location check if needed (though Logistics has it)
    const posyandu = await User.findById(req.user.id);

    // Calculate age in months for product selection
    const now = new Date();
    const dob = new Date(patient.dob);
    let ageMonths = (now.getFullYear() - dob.getFullYear()) * 12;
    ageMonths -= dob.getMonth();
    ageMonths += now.getMonth();

    // Get latest Z-Score
    const latestMeasurement = patient.measurements.length > 0 
      ? patient.measurements[patient.measurements.length - 1] 
      : null;

    // Create unique Request ID
    const requestId = `REQ-${Date.now()}-${patientId.substr(-4)}`;

    // Call Logistics API
    const payload = {
      health_request_id: requestId,
      posyandu_id: posyandu?.posyandu_details ? req.user.id : null, 
      patient_name: patient.name, 
      age_months: ageMonths,
      z_score: latestMeasurement ? latestMeasurement.z_score : 0,
      urgency: urgency || 'HIGH'
    };

    const response = await axios.post(`${LOGISTICS_URL}/api/internal/requests`, payload, {
      headers: { 'x-api-key': SHARED_SECRET }
    });

    // Save to Local DB (History)
    const newIntervention = new Intervention({
        posyandu_id: req.user.id,
        patient_id: patientId,
        request_id: requestId,
        urgency: urgency || 'HIGH',
        status: 'PENDING'
    });
    await newIntervention.save();

    res.status(201).json({ 
      message: 'Intervention Request Sent', 
      requestId, 
      logisticsStatus: response.data 
    });

  } catch (error: any) {
    console.error('Intervention Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to create intervention request', error: error.message });
  }
};

export const getInterventions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const interventions = await Intervention.find({ posyandu_id: req.user.id })
                                                .populate('patient_id', 'name')
                                                .sort({ created_at: -1 });
        res.json(interventions);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const confirmReceipt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { requestId } = req.body;

    // Verify ownership
    const intervention = await Intervention.findOne({ request_id: requestId });
    if (!intervention) {
        res.status(404).json({ message: 'Intervention Request not found' });
        return;
    }

    if (intervention.posyandu_id.toString() !== req.user.id) {
        res.status(403).json({ message: 'Not authorized' });
        return;
    }
    
    // Call Logistics to complete loop
    await axios.post(`${LOGISTICS_URL}/api/internal/delivery-confirm`, {
      health_request_id: requestId
    }, {
      headers: { 'x-api-key': SHARED_SECRET }
    });

    // Update Local Status
    intervention.status = 'DELIVERED';
    intervention.updated_at = new Date();
    await intervention.save();

    res.json({ message: 'Receipt Confirmed' });

  } catch (error: any) {
    res.status(500).json({ message: 'Failed to confirm receipt', error: error.message });
  }
};

export const cancelIntervention = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const intervention = await Intervention.findOne({ request_id: id });
    if (!intervention) {
      res.status(404).json({ message: 'Intervention not found' });
      return;
    }

    if (intervention.posyandu_id.toString() !== req.user.id) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    if (intervention.status === 'DELIVERED' || intervention.status === 'CANCELLED') {
        res.status(400).json({ message: 'Cannot cancel intervention in current status' });
        return;
    }

    intervention.status = 'CANCELLED';
    intervention.updated_at = new Date();
    await intervention.save();

    res.json({ message: 'Intervention Cancelled' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getInterventionDetailsInternal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { requestId } = req.params;

    const intervention = await Intervention.findOne({ request_id: requestId })
      .populate({
        path: 'patient_id',
        select: 'name dob gender measurements'
      });

    if (!intervention) {
      res.status(404).json({ message: 'Intervention not found' });
      return;
    }

    res.json(intervention);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getInterventionDetailsPublic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { requestId } = req.params;

    // This is accessed by Logistics Service (via Client)
    const intervention = await Intervention.findOne({ request_id: requestId })
      .populate({
        path: 'patient_id',
        select: 'name dob gender measurements'
      });

    if (!intervention) {
      res.status(404).json({ message: 'Intervention not found' });
      return;
    }

    res.json(intervention);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateShipmentDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { health_request_id, driver_name, driver_phone, eta } = req.body;

    const intervention = await Intervention.findOne({ request_id: health_request_id });
    if (!intervention) {
      res.status(404).json({ message: 'Intervention not found' });
      return;
    }

    intervention.driver_name = driver_name;
    intervention.driver_phone = driver_phone;
    intervention.eta = eta;
    intervention.status = 'ON_THE_WAY';
    intervention.shipped_at = new Date();
    intervention.updated_at = new Date();

    await intervention.save();

    res.json({ message: 'Shipment details updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
