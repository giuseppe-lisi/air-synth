import * as Tone from "tone";

export const createSynth = () => {
    // create filter
    const filter = new Tone.Filter({
        type: "lowpass",
        frequency: 1000,
    }).toDestination();
    // create 2 oscillators
    const osc1 = new Tone.OmniOscillator({
        volume: -12,
        type: "sine",
    }).connect(filter);
    const osc2 = new Tone.OmniOscillator({
        volume: -12,
        type: "sine",
    }).connect(filter);

    function startPlaying() {
        osc1.start();
        osc2.start();
    }

    function stopPlaying() {
        osc1.stop();
        osc2.stop();
    }

    function setWaveform(osc, wave) {
        osc == "osc1" ? (osc1.type = wave) : (osc2.type = wave);
        console.log("waves:", osc1.type, osc2.type);
    }

    function setVolume(osc, value) {
        osc == "osc1"
            ? osc1.volume.rampTo(value, 0.1)
            : osc2.volume.rampTo(value, 0.1);
    }

    function setCutoffFrequency(value) {
        filter.frequency.rampTo(value, 0.05);
    }

    function toSpeakers() {
        filter.toDestination();
    }

    return {
        osc1,
        osc2,
        filter,
        startPlaying,
        stopPlaying,
        setVolume,
        setWaveform,
        setCutoffFrequency,
        toSpeakers,
    };
};
