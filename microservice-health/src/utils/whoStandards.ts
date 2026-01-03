// Simplified WHO Standards Data (Weight-for-age Boys & Girls 0-5 years)
// Source: WHO Child Growth Standards
// Format: Age(Months) -> { -3SD, -2SD, Median, +2SD, +3SD }

export const WHO_WEIGHT_BOYS: Record<number, number[]> = {
    0: [2.1, 2.5, 3.3, 4.4, 5.0],
    6: [5.7, 6.4, 7.9, 9.8, 10.9],
    12: [7.7, 8.6, 9.6, 11.8, 13.3],
    24: [9.7, 10.8, 12.2, 14.8, 16.6],
    36: [11.3, 12.7, 14.3, 17.4, 19.4],
    48: [12.7, 14.4, 16.3, 19.9, 22.1],
    60: [14.1, 16.0, 18.3, 22.3, 24.8]
};

export const WHO_WEIGHT_GIRLS: Record<number, number[]> = {
    0: [2.0, 2.4, 3.2, 4.2, 4.8],
    6: [5.3, 5.8, 7.3, 9.3, 10.2],
    12: [7.0, 7.9, 8.9, 11.0, 12.3],
    24: [9.0, 10.2, 11.5, 14.2, 15.8],
    36: [10.8, 12.2, 13.9, 17.0, 18.8],
    48: [12.3, 14.0, 16.1, 19.7, 21.9],
    60: [13.7, 15.8, 18.2, 22.2, 24.4]
};

// Helper to interpolate between months if exact key missing
export const getStandard = (ageMonths: number, gender: 'MALE' | 'FEMALE') => {
    const table = gender === 'MALE' ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS;
    
    // Find closest keys
    const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
    
    // Exact match
    if (table[ageMonths]) return table[ageMonths];

    // Simple Linear Interpolation
    for (let i = 0; i < keys.length - 1; i++) {
        if (ageMonths > keys[i] && ageMonths < keys[i+1]) {
            const lower = keys[i];
            const upper = keys[i+1];
            const ratio = (ageMonths - lower) / (upper - lower);
            
            const lowerVals = table[lower];
            const upperVals = table[upper];
            
            return lowerVals.map((v, idx) => v + (upperVals[idx] - v) * ratio);
        }
    }
    
    // Fallback if out of range (use max)
    return table[keys[keys.length-1]];
};
