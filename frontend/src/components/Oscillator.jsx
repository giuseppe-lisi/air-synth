export function Oscillator({oscNum, synthRef}) {
    const handleDetuneDoubleClick = (e) => {
        if (e.target.name == "osc1") {
            synthRef.current?.setDetune("osc1", 0);
        } else {
            synthRef.current?.setDetune("osc2", 0);
        }
    };

    return (
        <>
            <div className="border rounded-2xl p-6 bg-base-100 shadow-sm flex-1">
                <legend className="fieldset-legend font-black text-lg mb-4 text-primary">
                    OSC {oscNum}
                </legend>

                <div className="form-control mb-4">
                    <legend className="fieldset-legend text-xs opacity-70 mb-2 uppercase tracking-wide">
                        Waveform
                    </legend>
                    <select
                        name={oscNum}
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

                {/* todo: handle detune of oscs */}
                {/* Detune
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
                </div> */}
            </div>
        </>
    );
}
