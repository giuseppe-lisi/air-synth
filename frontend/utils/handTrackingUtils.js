import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { useAdapatedFingersCoordsStore } from "../store/useAdapatedFingersCoordsStore";
const { setLeftIndexCoords, setRightIndexCoords } = useAdapatedFingersCoordsStore.getState();

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
                numHands: 2,
                runningMode: "VIDEO",
            },
        );
        return handLandmarkerModel;
    } catch (error) {
        console.log("Error initializing hand recognition: ", error.message);
    }
};

// gets handlandmarks positions on canvas given a video element
const getHandLandmarks = (video, canvas, handLandmarkerModel) => {
    // Handle missing elements
    if (!video || !handLandmarkerModel || video.readyState < 2) {
        return;
    }
    
    // hands model video where it needs to detect landmarks
    const detections = handLandmarkerModel.detectForVideo(
        video,
        performance.now(),
    );

    // draws hand landmarks on screen
    if (detections && detections.landmarks && detections.landmarks.length > 0) {
        drawHand(detections, canvas);
    } else {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // recursively call function to get new landmarks on next frame
    requestAnimationFrame(() =>
        getHandLandmarks(video, canvas, handLandmarkerModel),
    );
};

// draws landmark points on hand
const drawHand = (detections, canvas) => {
    // clears canvas from last frame
    const ctx = canvas.getContext("2d");

    // clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // updates global state of index coords
    setGlobalStateIndexCoords(detections)
    
    // draw new landmarks
    if (detections.landmarks) {
        for (const landmarks of detections.landmarks) {
            // only draws index and thumb points on canvas
            for (const point of [landmarks[4], landmarks[8]]) {
                ctx.beginPath();
                ctx.arc(point.x * canvas.width, point.y * canvas.height, 2.5, 0, 2 * Math.PI);
                ctx.fillStyle = "#00FF00";
                ctx.fill();
            }
        }
    }
};

const setGlobalStateIndexCoords = (detections) => {
    // check that we have data to look through
    if (!detections.landmarks || !detections.handedness) return;

    for (let i = 0; i < detections.landmarks.length; i++) {
        const landmarks = detections.landmarks[i];

        const coords = { x: landmarks[8].x, y: landmarks[8].y };
        
        // get hand we are trying to change coords of
        const handLabel = detections.handedness[i]?.[0]?.categoryName || detections.handedness[i]?.categoryName;

        if (handLabel === "Left") {
            setLeftIndexCoords(coords);
        } else if (handLabel === "Right") {
            setRightIndexCoords(coords);
        }
    }
};

export { initializeHandLandmarkerModel, getHandLandmarks };
