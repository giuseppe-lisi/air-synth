import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
    calculateLfoDepthFromFingerPosition,
    calculateLinearGainFromFingerPosition,
    calculateLogarithmicFingerPosition,
    calculatePitchFromFingerPosition,
} from "../utils/fingerCoordsAdaptationUtils";

export const useAdapatedFingersCoordsStore = create(
    subscribeWithSelector((set, get) => ({
        leftIndexCoords: { x: 0, y: 0 },
        rightIndexCoords: { x: 0, y: 0 },

        setLeftIndexCoords: (coords) => {
            coords.x = calculateLogarithmicFingerPosition(coords.x);
            coords.y = calculateLinearGainFromFingerPosition(coords.y);
            set({ leftIndexCoords: coords });
            console.log(get().leftIndexCoords);
        },
        setRightIndexCoords: (coords) => {
            coords.x = calculateLfoDepthFromFingerPosition(coords.x);
            coords.y = calculatePitchFromFingerPosition(coords.y);
            set({ rightIndexCoords: coords });
            console.log(get().rightIndexCoords);
        },
    })),
);
