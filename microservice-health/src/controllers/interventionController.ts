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

    // Create unique Request ID
    const requestId = `REQ-${Date.now()}-${patientId.substr(-4)}`;

    // Call Logistics API
    const payload = {
      health_request_id: requestId,
      posyandu_id: posyandu?.posyandu_details ? req.user.id : null, 
      patient_initials: patient.name.split(' ').map((n: string) => n[0]).join('.'), 
      age_months: ageMonths,
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
