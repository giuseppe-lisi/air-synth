import { useEffect, useRef, useState } from "react";
import { getWebcam } from "../utils/getWebcam.js";
import {
  createHandLandmarkerModel,
  drawHandLandmarks,
} from "../utils/handRecognition.js";

export default function VideoFeedComponent() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fingertipIndices = [4, 8];

  useEffect(() => {
    let webcam;
    let handLandmarkerModel;

    const initializeHandTrackingFunctionalities = async () => {
      try {
        webcam = await getWebcam();

        if (webcam && videoRef.current) {
          videoRef.current.srcObject = webcam;
        }

        handLandmarkerModel = await createHandLandmarkerModel();
        drawHandLandmarks(
          videoRef.current,
          handLandmarkerModel,
          canvasRef.current,
          fingertipIndices,
        );
      } catch (error) {
        console.log(
          "Error initializing hand tracking functionality: ",
          error.message,
        );
      }
    };

    initializeHandTrackingFunctionalities();

    // cleanup video streams on component unmount
    return () => {
      // webcam cleanup
      if (webcam) {
        webcam.getTracks().forEach((track) => {
          track.stop();
        });
        console.log("Webcam unmounted");
      }
      if (handLandmarkerModel) {
        handLandmarkerModel.close();
        console.log("Model disabled");
      }
    };
  }, []);

  return (
    <>
      <div className="p-6">
        <div className="relative w-[800px] h-[600px]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="transform -scale-x-100 absolute top-0 left-0 w-full h-full object-cover rounded-3xl shadow-lg"
          />
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="transform -scale-x-100 absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
          ></canvas>
        </div>
      </div>
    </>
  );
}
