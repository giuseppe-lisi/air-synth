import { useEffect, useRef, useState } from "react";
import { useHandPositionStore } from "../store/useHandPositionStore";
import * as Tone from "tone";
import { createSynth } from "../utils/synth";

export default function SynthComponent() {
    const [isPlaying, setIsPlaying] = useState(false);
    const synthRef = useRef(null);

    const handleClick = () => {
        if (!isPlaying) {
            synthRef.current.startPlaying();
            setIsPlaying(true);
        } else {
            synthRef.current.stopPlaying();
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        try {
            let synth = createSynth();
            synth.toSpeakers();
            if (!synthRef.current) {
                synthRef.current = synth;
            }
        } catch (error) {
            console.log(
                "Unable to create initialize tone.js objects: ",
                error.message,
            );
        }
    });

    return (
        <>
            <div className="p-6">
                <h3>Synth Parameters</h3>
                {/* start playback */}
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleClick}
                >
                    play
                </button>

                {/* Synth params */}
                <div>
                    {/* osc 1 params */}
                    <div>
                        {/* log volume slider */}
                        <input
                            type="range"
                            min="0"
                            max="1"
                            className="range"
                            name="osc1"
                            step={0.01}
                            onChange={(e) => {
                                // convert slider movement into logarythmic values
                                const linearGain = parseFloat(e.target.value);

                                const db = Tone.gainToDb(linearGain);
                                synthRef.current.setVolume(e.target.name, db);
                            }}
                        />
                        {/* Wave Picker */}
                        <legend className="fieldset-legend">
                            OSC1 - Waveform
                        </legend>
                        <select
                            name="osc1"
                            defaultValue="sine"
                            className="select"
                            onChange={(e) => {
                                synthRef.current.setWaveform(
                                    e.target.name,
                                    e.target.value,
                                );
                            }}
                        >
                            <option disabled={true}>waveform</option>
                            <option>sine</option>
                            <option>square</option>
                            <option>triangle</option>
                            <option>sawtooth</option>
                        </select>
                    </div>
                    {/* osc 2 params */}
                    <div>
                        {/* log volume slider */}
                        <input
                            type="range"
                            min="0"
                            max="1"
                            className="range"
                            name="osc2"
                            step={0.01}
                            onChange={(e) => {
                                // convert slider movement into logarythmic values
                                const linearGain = parseFloat(e.target.value);

                                const db = Tone.gainToDb(linearGain);
                                synthRef.current.setVolume(e.target.name, db);
                            }}
                        />
                        {/* Wave Picker */}
                        <legend className="fieldset-legend">
                            OSC1 - Waveform
                        </legend>
                        <select
                            name="osc2"
                            defaultValue="sine"
                            className="select"
                            onChange={(e) => {
                                synthRef.current.setWaveform(
                                    e.target.name,
                                    e.target.value,
                                );
                            }}
                        >
                            <option disabled={true}>waveform</option>
                            <option>sine</option>
                            <option>square</option>
                            <option>triangle</option>
                            <option>sawtooth</option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
}
