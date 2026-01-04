import { Request, Response } from 'express';
import Patient from '../models/Patient';
import Intervention from '../models/Intervention';

interface AuthRequest extends Request {
  user?: any;
}

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posyanduId = req.user.id;

    // 1. Total Children
    const total_children = await Patient.countDocuments({ posyandu_id: posyanduId });

    // 2. Active Interventions
    const active_interventions = await Intervention.countDocuments({
      posyandu_id: posyanduId,
      status: { $in: ['PENDING', 'ON_THE_WAY'] }
    });

    // 3. Health Status Counts (based on latest measurement)
    const patients = await Patient.find({ posyandu_id: posyanduId });
    
    let red_zone_count = 0;
    let healthy_count = 0;
    let at_risk_count = 0;

    patients.forEach(p => {
        if (p.measurements && p.measurements.length > 0) {
            const lastMeas = p.measurements[p.measurements.length - 1];
            if (lastMeas.status === 'SEVERELY_STUNTED') {
                red_zone_count++;
            } else if (lastMeas.status === 'NORMAL') {
                healthy_count++;
            } else {
                // RISK or STUNTED
                at_risk_count++;
            }
        }
    });

    res.json({
      total_children,
      active_interventions,
      red_zone_count,
      healthy_count,
      at_risk_count
    });

  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
