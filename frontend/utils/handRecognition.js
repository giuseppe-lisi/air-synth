import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

// initializes hand recognition model
const createHandLandmarkerModel = async () => {
  try {
    const vision = await FilesetResolver.forVisionTasks("/wasm");
    let handLandmarkerModel = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "/hand_landmarker.task",
      },
      numHands: 1,
      runningMode: "VIDEO",
    });
    return handLandmarkerModel;
  } catch (error) {
    console.log("Error initializing hand recognition: ", error.message);
  }
};

// detects and draw landmarks on given video stream
const drawHandLandmarks = (videoElement, handLandmarkerModel, canvas, fingertips) => {
  let detections;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (videoElement && handLandmarkerModel && videoElement.readyState >= 2) {
    detections = handLandmarkerModel.detectForVideo(
      videoElement,
      performance.now(),
    );
  }

  if (detections.landmarks.length > 0) {
    fingertips.forEach((fingertip) => {
      const x = detections.landmarks[0][fingertip].x * canvas.width;
      const y = detections.landmarks[0][fingertip].y * canvas.height;

      ctx.fillStyle = "lime";
      ctx.fillRect(x, y, 5, 5);
    });
  }
  // recursively detects hands on the next drawn frame on video stream
  requestAnimationFrame(() =>
    drawHandLandmarks(videoElement, handLandmarkerModel, canvas, fingertips),
  );
};

export { createHandLandmarkerModel, drawHandLandmarks };
