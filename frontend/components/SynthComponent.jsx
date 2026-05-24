import { useEffect, useRef, useState } from "react";
import { useHandPositionStore } from "../store/useHandPositionStore";
import * as Tone from "tone";

export default function SynthComponent() {
    const [isPlaying, setIsPlaying] = useState(false);
    const synthRef = useRef(null);

    const handleClick = () => {
        if (!synthRef.current) {
            let initialWaveform = "sawtooth";
            let synth = new Tone.Synth({
                oscillator: {
                    type: initialWaveform,
                },
            }).toDestination();
            synthRef.current = synth;
        }
        if (!isPlaying) {
            synthRef.current.triggerAttack("C4");
            setIsPlaying(true);
        } else {
            synthRef.current.triggerRelease();
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        const unsubscribe = useHandPositionStore.subscribe(
            (state) => state.indexY,
            (xValue) => {
                if (synthRef.current && !isNaN(xValue)) {
                    synthRef.current.frequency.rampTo(xValue, 0.05);
                }
            },
        );

        return () => unsubscribe();
    }, []);

    return (
        <>
            <div className="p-6">
                <h3>Synth Parameters</h3>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleClick}
                >
                    play
                </button>
                <div className="flex flex-col">
                    {/* waveform selector */}
                    <div className="my-6">
                        <legend className="fieldset-legend">Waveform</legend>
                        <select
                            defaultValue="Medium"
                            className="select select-md"
                            onChange={(e) => {
                                synthRef.current.oscillator.type =
                                    e.target.value;
                            }}
                        >
                            <option disabled={true}>Choose Waveform</option>
                            <option>sawtooth</option>
                            <option>triangle</option>
                            <option>square</option>
                            <option>sine</option>
                        </select>
                    </div>
                    {/* volume slider */}
                    <div>
                        <legend className="fieldset-legend">Volume</legend>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            className="range"
                            step={0.01}
                            onChange={(e) => {
                                // convert slider movement into logarythmic values
                                const linearGain = parseFloat(e.target.value);
                                const db = Tone.gainToDb(linearGain);
                                synthRef.current.volume.rampTo(db, 0.05);
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
