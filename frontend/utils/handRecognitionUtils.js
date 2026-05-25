import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { useHandPositionStore } from "../store/useHandPositionStore";
import calculateLogarithmicIndexFingerPosition from "./calculateLogarithmicIndexFingerPosition";

// initializes hand recognition model
const initializeHandLandmarkerModel = async () => {
    try {
        const vision = await FilesetResolver.forVisionTasks("/wasm");
        let handLandmarkerModel = await HandLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath: "/hand_landmarker.task",
                    delegate: "GPU",
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

// gets handlandmarks positions on canvas given a video element
const getHandLandmarks = (videoElement, canvasElement, handLandmarkerModel) => {
    // Handle missing elements
    if (!videoElement || !handLandmarkerModel || videoElement.readyState < 2) {
        return;
    }
    
    // hands model video where it needs to detect landmarks
    const detections = handLandmarkerModel.detectForVideo(
        videoElement,
        performance.now(),
    );

    // draws hand landmarks on screen
    if (detections && detections.landmarks && detections.landmarks.length > 0) {
        drawHand(detections, canvasElement)
    }

    // recursively call function to get new landmarks on next frame
    requestAnimationFrame(() =>
        getHandLandmarks(videoElement, canvasElement, handLandmarkerModel),
    );
};

// draws landmark points on hand
const drawHand = (detections, canvas) => {
    const ctx = canvas.getContext("2d");
    
    // clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // draw new landmarks
    if (detections.landmarks) {
        for (const landmarks of detections.landmarks) {
            for (const point of landmarks) {
                ctx.beginPath();
                ctx.arc(point.x * canvas.width, point.y * canvas.height, 5, 0, 2 * Math.PI);
                ctx.fillStyle = "#00FF00";
                ctx.fill();
            }
        }
    }
};

export { initializeHandLandmarkerModel, getHandLandmarks };
