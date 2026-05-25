export function Filter({ synthRef }) {
    return (
        <>
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
                            synthRef.current?.setFilterType(e.target.value);
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
                        className="select select-bordered select-sm w-full"
                        onChange={(e) => {
                            synthRef.current?.setFilterRolloff(e.target.value);
                        }}
                    >
                        <option disabled={true}>rolloff</option>
                        <option>-12</option>
                        <option>-24</option>
                        <option>-48</option>
                    </select>
                </div>
            </div>
        </>
    );
}
