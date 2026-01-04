import { Request, Response } from 'express';
import Patient from '../models/Patient';
import { calculateZScore } from '../utils/zScoreCalculator';

// Auth Request interface
interface AuthRequest extends Request {
  user?: any;
}

export const createPatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, dob, gender } = req.body;
    
    const newPatient = new Patient({
      posyandu_id: req.user.id,
      name,
      dob,
      gender
    });

    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addMeasurement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;
    const { weight, height, date } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    if (patient.posyandu_id.toString() !== req.user.id) {
        res.status(403).json({ message: 'Not authorized' });
        return;
    }

    // Calculate Age in Months
    const measureDate = date ? new Date(date) : new Date();
    const dob = new Date(patient.dob);
    let ageMonths = (measureDate.getFullYear() - dob.getFullYear()) * 12;
    ageMonths -= dob.getMonth();
    ageMonths += measureDate.getMonth();

    const { zScore, status } = calculateZScore(ageMonths, patient.gender, weight, height);

    patient.measurements.push({
      date: measureDate,
      weight,
      height,
      z_score: zScore,
      status: status as any
    });

    await patient.save();

    res.json({ measurement: patient.measurements[patient.measurements.length - 1], alert: status === 'SEVERELY_STUNTED' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPatients = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const patients = await Patient.find({ posyandu_id: req.user.id });
        res.json(patients);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const getPatientById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    if (patient.posyandu_id.toString() !== req.user.id) {
        res.status(403).json({ message: 'Not authorized' });
        return;
    }

    res.json(patient);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
