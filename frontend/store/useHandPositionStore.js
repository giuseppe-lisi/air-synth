import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
export const useHandPositionStore = create(
    subscribeWithSelector((set, get) => ({
        indexX: 0,
        indexY: 0,

        setIndexPosition: (x, y) => {
            set({ indexX: x, indexY: y });
        },
    })),
);
