import { useEffect, useRef, useState } from "react";
import { useHandPositionStore } from "../store/useHandPositionStore";
import * as Tone from "tone";

export default function SynthComponent() {
	const [isPlaying, setIsPlaying] = useState(false);
	const synthRef = useRef(null);

	const handleClick = () => {
		if (!synthRef.current) {
			let filter = new Tone.Filter({
				frequency: 4000,
				type: "lowpass",
				rolloff: -12,
			});
			synthRef.current = new Tone.Synth({ frequency: 500 })
				.connect(filter)
				.toDestination();
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
				<div>
					<input type="range" min="0" max="100" className="range" />
				</div>
			</div>
		</>
	);
}
