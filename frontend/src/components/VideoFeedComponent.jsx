import { useEffect, useRef, useState } from "react";
import { getWebcam } from "../../utils/getWebcamUtil.js";
import { initializeHandLandmarkerModel, getHandLandmarks } from "../../utils/handTrackingUtils.js";

export default function VideoFeedComponent() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        let webcam;
        let handLandmarkerModel;

        const initializeHandTrackingFunctionalities = async () => {
            try {
                webcam = await getWebcam();
                
                // Initializes hand recognition model
                handLandmarkerModel = await initializeHandLandmarkerModel();

                if (webcam && videoRef.current) {

                    // Dynamically match internal canvas resolution to the real webcam feed
                    videoRef.current.onloadedmetadata = () => {
                        if (canvasRef.current && videoRef.current) {
                            canvasRef.current.width =
                                videoRef.current.videoWidth;
                            canvasRef.current.height =
                                videoRef.current.videoHeight;
                        }

                        // Start the recursive tracking loop once resolutions match
                        getHandLandmarks(
                            videoRef.current,
                            canvasRef.current,
                            handLandmarkerModel,
                        );
                    };
                }

                videoRef.current.srcObject = webcam;

            } catch (error) {
                console.log(
                    "Error initializing hand tracking functionality: ",
                    error.message,
                );
            }
        };

        initializeHandTrackingFunctionalities();

        // Cleanup video streams and models on component unmount
        return () => {
            if (webcam) {
                webcam.getTracks().forEach((track) => track.stop());
            }
            if (handLandmarkerModel) {
                handLandmarkerModel.close();
            }
        };
    }, []);

    return (
        <div className="p-6">
            <div className="relative w-[800px] h-[600px] overflow-hidden rounded-3xl shadow-lg">
                {/* webcam stream */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="transform -scale-x-100 absolute top-0 left-0 w-full h-full object-cover"
                />
                {/* canvas */}
                <canvas
                    ref={canvasRef}
                    className="transform -scale-x-100 absolute top-0 left-0 w-full h-full z-10 pointer-events-none object-cover"
                ></canvas>
            </div>
        </div>
    );
}
