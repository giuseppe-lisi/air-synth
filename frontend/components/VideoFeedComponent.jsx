import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

export default function VideoFeedComponent() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let webcam = null;
    let animationFrameId;
    let handLandmarker;

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
          drawLandmarks(detections.landmarks);
        }
      }
      // recursively detects hands on the next drawn frame on video stream
      requestAnimationFrame(detectHands);
    };

    // draws circles on landmarks on recognized hand
    const drawLandmarks = (landmarksArray) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "lime";

      landmarksArray.forEach((landmarks) => {
        landmarks.forEach((landmark, i, landmarks) => {
          const x = landmark.x * canvas.width;
          const y = landmark.y * canvas.height;

          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fill();
        });
      });
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
      <div className="app">
        <div style={{ position: "relative" }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ position: "absolute" }}
          />
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ position: "absolute" }}
          ></canvas>
        </div>
      </div>
    </>
  );
}
