import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { useParametersStore } from "../store/useParametersStore";

export default function VideoFeedComponent() {
  const { setCutoff } = useParametersStore();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let webcam = null;
    let animationFrameId;
    let handLandmarker;

    const detectHands = () => {
      if (
        videoRef.current &&
        videoRef.current.readyState > 0 &&
        handLandmarker
      ) {
        const detections = handLandmarker.detectForVideo(
          videoRef.current,
          performance.now(),
        );

        // drawns tracking circles on landmarks
        if (detections.landmarks) {
          drawLandmarks(detections.landmarks[0]);
        }
      }
      // recursively detects hands on the next drawn frame on video stream
      requestAnimationFrame(detectHands);
    };

    // draws circles on landmarks on recognized hand
    const drawLandmarks = (landmarksArray) => {
      const canvas = canvasRef.current;
      if (!canvas || !landmarksArray) {
        if (canvas) {
          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        }
        return;
      }
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "lime";

      if (!landmarksArray) return;

      const fingertipIndices = [4, 8, 12, 16, 20];
      landmarksArray.forEach((landmark, i) => {
        if (fingertipIndices.includes(i)) {
          const x = landmark.x * canvas.width;
          const y = landmark.y * canvas.height;

          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    };

    // initializes hand recognition model
    const startHandRecognition = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("/wasm");
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/hand_landmarker.task",
          },
          numHands: 1,
          runningMode: "VIDEO",
        });
        detectHands();
      } catch (error) {
        console.log("Error initializing hand recognition", error.message);
      }
    };

    // gets access to camera on page load
    const getCameraFeed = async () => {
      try {
        let stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 800, height: 600, frameRate: { ideal: 60 } },
          audio: false,
        });

        videoRef.current.srcObject = stream;
        webcam = stream;
      } catch (error) {
        console.log("Could not activate webcam feed:", error.message);
      }
    };

    getCameraFeed().then(() => {
      startHandRecognition();
    });

    // cleanup video streams on component unmount
    return () => {
      // webcam cleanup
      if (webcam) {
        webcam.getTracks().forEach((track) => {
          track.stop();
        });
        console.log("Webcam unmounted");
      }

      // hand detection model cleanup
      if (handLandmarker) {
        handLandmarker.close();
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
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
            className="absolute top-0 left-0 w-full h-full object-cover rounded-3xl shadow-lg"
          />
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
          ></canvas>
        </div>
      </div>
    </>
  );
}
