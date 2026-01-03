import { getStandard } from './whoStandards';

export const calculateZScore = (ageMonths: number, gender: 'MALE' | 'FEMALE', weight: number, height: number) => {
  // Using Weight-for-Age (WFA) as the primary indicator for this prototype
  // Standards: [ -3SD, -2SD, Median, +2SD, +3SD ]
  
  const standards = getStandard(ageMonths, gender);
  
  // Calculate approximate Z-Score
  // Formula: Z = (Value - Median) / SD
  // We deduce SD based on the difference between Median and -1SD (approximated from table)
  
  const median = standards[2];
  const minus1SD = (standards[1] + standards[2]) / 2; // Rough approximation
  const sigma = median - minus1SD;

  const zScore = (weight - median) / sigma;

  let status = 'NORMAL';
  if (zScore < -3) status = 'SEVERELY_STUNTED'; 
  else if (zScore < -2) status = 'STUNTED';
  else if (zScore < -1) status = 'RISK';

  return { zScore: parseFloat(zScore.toFixed(2)), status };
};
