import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useHandTrackingCoordsStore = create(
    subscribeWithSelector((set, get) => ({
        leftIndexCoords: { x: 0, y: 0 },
        rightIndexCoords: { x: 0, y: 0 },

        setLeftIndexCoords: (coords) => {
            set({ leftIndexCoords: coords });
            console.log(get().leftIndexCoords);
            
        },
        setRightIndexCoords: (coords) => {
            set({ rightIndexCoords: coords });
            console.log(get().rightIndexCoords);
            
        },
    })),
);
