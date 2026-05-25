const MIN_FREQ = 20;
const MAX_FREQ = 16000;
const FREQ_RATIO = MAX_FREQ / MIN_FREQ;

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// calculates finger pos in log in audible range (20-20k Hz)
export function calculateLogarithmicFingerPosition(pos) {
    const clampedPos = Math.min(Math.max(pos, 0), 1);
    // invert position -> right goes up
    const adjustedPos = 1 - clampedPos;
    // calculate log
    const frequency = MIN_FREQ * Math.pow(FREQ_RATIO, adjustedPos);
    // return with no decimals
    return Math.round(frequency);
}

// we use linear gain as Tone.js does the conversion in log db
export function calculateLinearGainFromFingerPosition(pos) {
    const clampedPos = Math.min(Math.max(pos, 0.5), 1.0);
    const linearGain = (1.0 - clampedPos) / 0.5;

    return parseFloat(linearGain.toFixed(4));
}

// vertical movement equates to pitch change over 2 octaves
export function calculatePitchFromFingerPosition(pos) {
    const fMin = 130.81; 
    const fMax = 523.25;
    
    // 2. Restrict the active webcam window between Y = 0.2 and Y = 0.8
    const clampedPos = Math.min(Math.max(pos, 0.2), 0.8);
    
    // 3. Normalize the 0.2 to 0.8 range into a clean 0.0 to 1.0 percentage.
    // We do (0.8 - clampedPos) so that moving UP (smaller Y) INCREASES the pitch.
    const normalizedProgress = (0.8 - clampedPos) / 0.6;
    
    // 4. Equal temperament exponential mapping across exactly 2 octaves
    const frequency = fMin * Math.pow(fMax / fMin, normalizedProgress);
    
    // 5. Round to 2 decimal places for clean audio frequency precision
    return parseFloat(frequency.toFixed(2));
}

// lfo control right hand horizontal movement 1/4 of screen
export function calculateLfoDepthFromFingerPosition(pos) {
    // 1. Clamp to the shifted quarter window (0.2 to 0.45)
    const clampedPos = Math.min(Math.max(pos, 0.2), 0.45);
    
    // 2. Map this 0.25 wide window to a 0.0 - 1.0 percentage
    const depth = (clampedPos - 0.2) / 0.25;
    
    return parseFloat(depth.toFixed(4));
}