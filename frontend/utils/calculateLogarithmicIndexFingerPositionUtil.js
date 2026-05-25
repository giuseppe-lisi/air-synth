const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const MIN_FREQ = 80;
const MAX_FREQ = 16000;
const FREQ_RATIO = MAX_FREQ / MIN_FREQ;

function calculateLogarithmicIndexFingerPosition(x, y) {
    const invertedX = clamp(1 - x, 0, 1);
    const invertedY = clamp(1 - y, 0, 1);

    const logX = MIN_FREQ * Math.pow(FREQ_RATIO, invertedX);
    const logY = MIN_FREQ * Math.pow(FREQ_RATIO, invertedY);

    return { logX, logY };
}

export default calculateLogarithmicIndexFingerPosition;
