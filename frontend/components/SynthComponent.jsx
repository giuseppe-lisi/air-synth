import { useEffect, useRef, useState } from "react";
import { useHandPositionStore } from "../store/useHandPositionStore";
import * as Tone from "tone";
import { createSynth } from "../utils/synth";

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

    const handleDetuneDoubleClick = (e) => {
        if (e.target.name == "osc1") {
            synthRef.current?.setDetune("osc1", 0);
        } else {
            synthRef.current?.setDetune("osc2", 0);
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

        const unsubscribe = useHandPositionStore.subscribe(
            (state) => state.indexX,
            (xValue) => {
                if (synthRef.current) {
                    synthRef.current.setFilterCutoffFrequency(xValue);
                }
            },
        );

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <>
            <div className="p-6 w-full">
                <h3 className="text-xl font-bold mb-4">Synth Parameters</h3>

                {/* start playback */}
                <button
                    className={`btn font-bold py-2 px-4 rounded-xl mb-6 text-white ${
                        isPlaying
                            ? "bg-red-500 hover:bg-red-700"
                            : "bg-blue-500 hover:bg-blue-700"
                    }`}
                    onClick={handleClick}
                >
                    {isPlaying ? "stop" : "play"}
                </button>

                {/* Synth params layout grid */}
                <div className="w-full">
                    {/* OSC LAYOUT */}
                    <div className="flex gap-6 w-full">
                        {/* OSC 1 BLOCK */}
                        <div className="border rounded-2xl p-6 bg-base-100 shadow-sm flex-1">
                            <legend className="fieldset-legend font-black text-lg mb-4 text-primary">
                                OSC 1
                            </legend>

                            <div className="form-control mb-4">
                                <legend className="fieldset-legend text-xs opacity-70 mb-2 uppercase tracking-wide">
                                    Waveform
                                </legend>
                                <select
                                    name="osc1"
                                    defaultValue="sine"
                                    className="select select-bordered select-sm w-full"
                                    onChange={(e) => {
                                        synthRef.current?.setWaveform(
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

                            <div className="form-control">
                                <legend className="fieldset-legend text-xs opacity-70 uppercase tracking-wide">
                                    Volume
                                </legend>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    className="range range-xs"
                                    name="osc1"
                                    step={0.01}
                                    onChange={(e) => {
                                        const linearGain = parseFloat(
                                            e.target.value,
                                        );
                                        const db = Tone.gainToDb(linearGain);
                                        synthRef.current?.setVolume(
                                            e.target.name,
                                            db,
                                        );
                                    }}
                                />
                            </div>

                            {/* Detune */}
                            <div className="form-control">
                                <legend className="fieldset-legend text-xs opacity-70 uppercase tracking-wide">
                                    Detune
                                </legend>
                                <input
                                    type="range"
                                    min="-500"
                                    max="500"
                                    className="range range-xs"
                                    name="osc1"
                                    step={1}
                                    onDoubleClick={(e) => {
                                        handleDetuneDoubleClick(e);
                                        e.target.value = detuneDefaultValue;
                                    }}
                                    onChange={(e) => {
                                        synthRef.current?.setDetune(
                                            e.target.name,
                                            Number(e.target.value),
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        {/* OSC 2  */}
                        <div className="border rounded-2xl p-6 bg-base-100 shadow-sm flex-1">
                            <legend className="fieldset-legend font-black text-lg mb-4 text-secondary">
                                OSC 2
                            </legend>

                            <div className="form-control mb-4">
                                <legend className="fieldset-legend text-xs opacity-70 uppercase mb-2">
                                    Waveform
                                </legend>
                                <select
                                    name="osc2"
                                    defaultValue="sine"
                                    className="select select-bordered select-sm w-full"
                                    onChange={(e) => {
                                        synthRef.current?.setWaveform(
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

                            <div className="form-control">
                                <legend className="fieldset-legend text-xs opacity-70">
                                    VOLUME
                                </legend>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    className="range range-xs"
                                    name="osc2"
                                    step={0.01}
                                    onChange={(e) => {
                                        const linearGain = parseFloat(
                                            e.target.value,
                                        );
                                        const db = Tone.gainToDb(linearGain);
                                        synthRef.current?.setVolume(
                                            e.target.name,
                                            db,
                                        );
                                    }}
                                />
                            </div>

                            {/* Detune */}
                            <div className="form-control">
                                <legend className="fieldset-legend text-xs opacity-70 uppercase tracking-wide">
                                    Detune
                                </legend>
                                <input
                                    type="range"
                                    min="-500"
                                    max="500"
                                    className="range range-xs"
                                    name="osc2"
                                    step={1}
                                    onDoubleClick={(e) => {
                                        handleDetuneDoubleClick(e);
                                        e.target.value = detuneDefaultValue;
                                    }}
                                    onChange={(e) => {
                                        synthRef.current?.setDetune(
                                            e.target.name,
                                            Number(e.target.value),
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* filter and envelope params */}
                    <div className="flex gap-6 w-full mt-6">
                        {/* filter */}
                        <div className="border rounded-2xl p-6 bg-base-100 shadow-sm flex-1">
                            <legend className="fieldset-legend font-black text-lg mb-4 text-accent">
                                FILTER
                            </legend>

                            <div className="form-control mb-4">
                                <legend className="fieldset-legend text-xs opacity-70 mb-2 uppercase tracking-wide">
                                    Type
                                </legend>
                                <select
                                    name="osc1"
                                    defaultValue="sine"
                                    className="select select-bordered select-sm w-full"
                                    onChange={(e) => {
                                        synthRef.current?.setFilterType(
                                            e.target.value,
                                        );
                                    }}
                                >
                                    <option disabled={true}>type</option>
                                    <option>lowpass</option>
                                    <option>highpass</option>
                                    <option>notch</option>
                                    <option>bandpass</option>
                                </select>
                            </div>
                            <div className="form-control mb-4">
                                <legend className="fieldset-legend text-xs opacity-70 mb-2 uppercase tracking-wide">
                                    Type
                                </legend>
                                <select
                                    name="osc1"
                                    defaultValue="sine"
                                    className="select select-bordered select-sm w-full"
                                    onChange={(e) => {
                                        synthRef.current?.setFilterRolloff(
                                            e.target.value,
                                        );
                                    }}
                                >
                                    <option disabled={true}>rolloff</option>
                                    <option>-12</option>
                                    <option>-24</option>
                                    <option>-48</option>
                                </select>
                            </div>
                        </div>
                        {/* todo: envelope */}
                    </div>
                </div>
            </div>
        </>
    );
}
