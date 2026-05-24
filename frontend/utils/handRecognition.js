import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { useHandPositionStore } from "../store/useHandPositionStore";

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// initializes hand recognition model
const createHandLandmarkerModel = async () => {
	try {
		const vision = await FilesetResolver.forVisionTasks("/wasm");
		let handLandmarkerModel = await HandLandmarker.createFromOptions(
			vision,
			{
				baseOptions: {
					modelAssetPath: "/hand_landmarker.task",
				},
				numHands: 1,
				runningMode: "VIDEO",
			},
		);
		return handLandmarkerModel;
	} catch (error) {
		console.log("Error initializing hand recognition: ", error.message);
	}
};

// detects and draw landmarks on given video stream
let lastVideoTime = -1;

const drawHandLandmarks = (
	videoElement,
	handLandmarkerModel,
	canvas,
	fingertips,
) => {
	// Handle missing elements
	if (
		!videoElement ||
		!handLandmarkerModel ||
		!canvas ||
		videoElement.readyState < 2
	) {
		requestAnimationFrame(() =>
			drawHandLandmarks(
				videoElement,
				handLandmarkerModel,
				canvas,
				fingertips,
			),
		);
		return;
	}

	const ctx = canvas.getContext("2d");
	const timestamp = performance.now();
	let detections = null;

	// Only run mediapipe on new frames
	if (videoElement.currentTime !== lastVideoTime) {
		lastVideoTime = videoElement.currentTime;

		detections = handLandmarkerModel.detectForVideo(
			videoElement,
			timestamp,
		);

		// Only clear and redraw canvas if we ran a detection
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (
			detections &&
			detections.landmarks &&
			detections.landmarks.length > 0
		) {
			if (detections.landmarks[0][8]) {
				const { x, y } = detections.landmarks[0][8];

				const normalizedX = clamp((1 - x) * 1000, 50, 1000);
				const normalizedY = clamp((1 - y) * 1000, 50, 1000);
				console.log(normalizedX, normalizedY);
				
				// only update state if the movement was substantial, otherwise, keep current state
				const currentStore = useHandPositionStore.getState();
				if (
					Math.abs(normalizedX - currentStore.indexX) > 4 ||
					Math.abs(normalizedY - currentStore.indexY) > 4
				) {
					currentStore.setIndexPosition(normalizedX, normalizedY);
				}
			}

			// Draw landmarks
			fingertips.forEach((fingertip) => {
				if (detections.landmarks[0][fingertip]) {
					const x =
						detections.landmarks[0][fingertip].x * canvas.width;
					const y =
						detections.landmarks[0][fingertip].y * canvas.height;
					ctx.fillStyle = "lime";
					ctx.fillRect(x, y, 10, 10);
				}
			});
		}
	}

	// Recursively call next frame
	requestAnimationFrame(() =>
		drawHandLandmarks(
			videoElement,
			handLandmarkerModel,
			canvas,
			fingertips,
		),
	);
};

export { createHandLandmarkerModel, drawHandLandmarks };
