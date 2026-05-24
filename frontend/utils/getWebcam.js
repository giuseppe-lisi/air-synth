// gets access to camera on page load
const getWebcam = async () => {
	try {
		let stream = await navigator.mediaDevices.getUserMedia({
			video: {
				width: { ideal: 640 },
				height: { ideal: 480 },
				frameRate: { ideal: 30 }, // 30 FPS is plenty for responsive synth tracking!
			},
			audio: false,
		});
		return stream;
	} catch (error) {
		console.log("Could not activate webcam feed:", error.message);
	}
};

export { getWebcam };
