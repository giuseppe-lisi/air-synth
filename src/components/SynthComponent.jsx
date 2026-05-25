import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { createSynth } from "../../utils/synth";
import { useAdapatedFingersCoordsStore } from "../../store/useAdapatedFingersCoordsStore";
import { Oscillator } from "./Oscillator";
import { Filter } from "./Filter";

export default function SynthComponent() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [detuneDefaultValue, setDetuneDefaultValue] = useState(0);
    const synthRef = useRef(null);

    const handleClick = async () => {
        // checks audio context is initialized
        if (Tone.context.state !== "running") {
            await Tone.start();
        }

        if (!isPlaying) {
            synthRef.current?.startPlaying();
            setIsPlaying(true);
        } else {
            synthRef.current?.stopPlaying();
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        // initialize synth
        try {
            let synth = createSynth();
            synth.toSpeakers();
            if (!synthRef.current) {
                synthRef.current = synth;
            }
        } catch (error) {
            console.log(
                "Unable to initialize tone.js objects: ",
                error.message,
            );
        }

        const unsubscribe = useAdapatedFingersCoordsStore.subscribe(
            (state) => ({
                leftIndexCoords: state.leftIndexCoords,
                rightIndexCoords: state.rightIndexCoords,
            }),
            ({ leftIndexCoords, rightIndexCoords }) => {
                if (!synthRef.current) {
                    return;
                }

                synthRef.current.setVolume(leftIndexCoords.y);
                synthRef.current.setFilterCutoffFrequency(leftIndexCoords.x);
                synthRef.current.setFrequency(rightIndexCoords.y);

                // todo: hook up lfo to right index x position
            },
        );

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <>
            <div className="p-6 w-full">
                <h3 className="text-xl font-bold mb-3">Air Synth</h3>
                {/* Synth components layout grid */}
                <div className="w-full">
                    {/* OSC LAYOUT */}
                    <div className="flex gap-6 w-full">
                        {/* OSC 1 BLOCK */}
                        <Oscillator oscNum="osc1" synthRef={synthRef} />
                        {/* OSC 2 BLOCK */}
                        <Oscillator oscNum="osc2" synthRef={synthRef} />
                    </div>

                    {/* filter and envelope params */}
                    <div className="flex gap-6 w-full mt-6">
                        {/* todo: lfo */}

                        {/* filter */}
                        <Filter synthRef={synthRef} />
                    </div>

                                    {/* start playback */}
                <button
                    className={`btn font-bold py-2 px-4 rounded-xl mt-6 text-white w-full ${
                        isPlaying
                            ? "bg-red-500 hover:bg-red-700"
                            : "bg-blue-500 hover:bg-blue-700"
                    }`}
                    onClick={handleClick}
                >
                    {isPlaying ? "stop" : "play"}
                </button>
                </div>
            </div>
        </>
    );
}
