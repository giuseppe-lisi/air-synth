import { useEffect, useRef, useState } from "react";
import { getWebcam } from "../utils/getWebcamUtil.js";
import {
    initializeHandLandmarkerModel,
    getHandLandmarks,
} from "../utils/handTrackingUtils.js";

export default function VideoFeedComponent() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        let webcam;
        let handLandmarkerModel;

        const initializeHandTrackingFunctionalities = async () => {
            try {
                webcam = await getWebcam();

                // sets source for landmark model to be the webcam video on screen
                if (webcam && videoRef.current) {
                    videoRef.current.srcObject = webcam;
                }

                // initializes hand recognition model
                handLandmarkerModel = await initializeHandLandmarkerModel();

                // starts recursive loop to get new handlandmarks on every new frame of webcam stream
                getHandLandmarks(
                    videoRef.current,
                    canvasRef.current,
                    handLandmarkerModel,
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
                webcam.getTracks().forEach((track) => track.stop());
            }
            // closes hand tracking model
            if (handLandmarkerModel) {
                handLandmarkerModel.close();
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
