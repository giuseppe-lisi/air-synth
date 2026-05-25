import React, { useMemo } from "react";
import { useAdapatedFingersCoordsStore } from "../../store/useAdapatedFingersCoordsStore";

// 24 Semitones from C3 to C5 (ordered top-to-bottom: highest pitch to lowest pitch)
// Because your formula maps vertical progress exponentially, every semitone occupies
// an exactly equal vertical height slice (1/24th) to stay perfectly in tune with the tracking.
const KEYBOARD_DATA = [
    { note: "C5", freq: 523 },
    { note: "B4", freq: 494 },
    { note: "A#4", freq: 466 },
    { note: "A4", freq: 440 },
    { note: "G#4", freq: 415 },
    { note: "G4", freq: 392 },
    { note: "F#4", freq: 370 },
    { note: "F4", freq: 349 },
    { note: "E4", freq: 330 },
    { note: "D#4", freq: 311 },
    { note: "D4", freq: 294 },
    { note: "C#4", freq: 277 },
    { note: "C4", freq: 262 }, // Middle C
    { note: "B3", freq: 247 },
    { note: "A#3", freq: 233 },
    { note: "A3", freq: 220 },
    { note: "G#3", freq: 208 },
    { note: "G3", freq: 196 },
    { note: "F#3", freq: 185 },
    { note: "F3", freq: 175 },
    { note: "E3", freq: 165 },
    { note: "D#3", freq: 156 },
    { note: "D3", freq: 147 },
    { note: "C#3", freq: 139 },
    { note: "C3", freq: 131 },
];

// Logarithmic X-Axis marker placements from 20Hz to 16kHz
const X_AXIS_FREQUENCIES = [
    { label: "20Hz", left: "0%" },
    { label: "55Hz", left: "15%" },
    { label: "110Hz", left: "25%" },
    { label: "220Hz", left: "35%" },
    { label: "445Hz", left: "48%" },
    { label: "880Hz", left: "58%" },
    { label: "1.8kHz", left: "69%" },
    { label: "3.5kHz", left: "79%" },
    { label: "7kHz", left: "90%" },
    { label: "16kHz", left: "100%" },
];

const findNearestNoteIndex = (frequency) => {
    if (!frequency || Number.isNaN(frequency) || frequency <= 0) {
        return -1;
    }

    return KEYBOARD_DATA.reduce((closestIndex, item, index) => {
        const closestFreq = KEYBOARD_DATA[closestIndex].freq;
        const currentDistance = Math.abs(item.freq - frequency);
        const closestDistance = Math.abs(closestFreq - frequency);
        return currentDistance < closestDistance ? index : closestIndex;
    }, 0);
};

export default function AudioMatrixOverlay() {
    const rightIndexFrequency = useAdapatedFingersCoordsStore(
        (state) => state.rightIndexCoords.y,
    );

    const activeNoteIndex = useMemo(
        () => findNearestNoteIndex(rightIndexFrequency),
        [rightIndexFrequency],
    );

    return (
        <div className="absolute inset-0 z-20 pointer-events-none select-none font-mono text-[9px] text-white/80">
            {/* 1. RIGHT SIDE VERTICAL PITCH PANEL (Clamped perfectly between Y = 0.2 and Y = 0.8) */}
            <div
                className="absolute right-0 w-20 border-l border-white/20 bg-black/40 backdrop-blur-[1px]"
                style={{ top: "20%", height: "60%" }}
            >
                <div className="flex flex-col h-full w-full">
                    {KEYBOARD_DATA.map((item, index) => {
                        const isActive = index === activeNoteIndex;
                        const isBlackKey = item.note.includes("#");
                        return (
                            <div
                                key={`${item.note}-${index}`}
                                className={`relative flex items-center justify-between px-2 h-[4.166%] w-full border-b ${
                                    isBlackKey
                                        ? "bg-slate-950 border-white/10"
                                        : "bg-slate-100 border-slate-300"
                                } transition-colors duration-150 ${
                                    isActive
                                        ? isBlackKey
                                            ? "ring-2 ring-amber-300/70"
                                            : "ring-2 ring-slate-800/40"
                                        : ""
                                }`}
                            >
                                {/* Note Name */}
                                <span
                                    className={`font-bold ${isBlackKey ? "text-white" : "text-slate-900"}`}
                                >
                                    {item.note}
                                </span>

                                {/* Frequency text */}
                                <span
                                    className={`text-[8px] ${isBlackKey ? "text-slate-300" : "text-slate-500"}`}
                                >
                                    {item.freq}
                                </span>

                                {/* Precise horizontal alignment line across the webcam space */}
                                <div className="absolute right-full top-0 w-200 border-t border-white/5" />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. BOTTOM HORIZONTAL LOGARITHMIC FREQUENCY SCALE (Spans full width) */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/60 border-t border-white/20 flex items-end pb-1">
                <div className="relative w-full h-full">
                    {X_AXIS_FREQUENCIES.map((tick, index) => (
                        <div
                            key={`x-tick-${index}`}
                            className="absolute bottom-0 transform -translate-x-1/2 flex flex-col items-center"
                            style={{ left: tick.left }}
                        >
                            {/* Frequency text value */}
                            <span className="text-[9px] tracking-tighter opacity-80 mb-1 whitespace-nowrap">
                                {tick.label}
                            </span>

                            {/* Visual index tick mark */}
                            <div className="h-2 w-px bg-white/40" />

                            {/* Vertical guideline running up the video frame */}
                            <div className="absolute bottom-11 h-150 border-l border-dashed border-white/5" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Dynamic Active Play Zone Shading */}
            <div className="absolute left-0 right-0 top-[20%] bottom-12 border-y border-dashed border-amber-500/10 bg-amber-500/1" />
        </div>
    );
}
