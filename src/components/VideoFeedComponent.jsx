import { useEffect, useRef, useState } from "react";
import { getWebcam } from "../../utils/getWebcamUtil.js";
import {
    initializeHandLandmarkerModel,
    getHandLandmarks,
} from "../../utils/handTrackingUtils.js";
import AudioMatrixOverlay from "./AudioMatrixOverlay.jsx";

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

                {/* piano keyboard */}
                <AudioMatrixOverlay />
            </div>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <button
                className="btn bg-blue-500 rounded-xl text-white mt-6 w-full"
                onClick={() =>
                    document.getElementById("my_modal_2").showModal()
                }
            >
                Help
            </button>
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box min-w-2xl max-h-[500px] overflow-scroll">
                    <h2 className="font-bold text-2xl">
                        Air Synth is a hand motion controlled synth
                    </h2>
                    <img src="instructions.png" className="mt-6" />
                    <p className="py-4">
                        Put your hands in an ok shape and start moving them
                        around, the webcam will track them! (index finger is the
                        refence for value changes)
                    </p>
                    <div className="flex">
                        <img src="ok_hand.png" className="max-w-[50%] me-3" />
                        <div>
                            <p>
                                The pitch has a 2 octave range and the
                                oscillators can be detuned to a max of +/- 7 st
                                (700 cents signed range)
                            </p>
                            <p className="mt-6">
                                Play around with the settings and see what
                                sounds you can come up with... for example: can
                                you make a car engine sound?
                            </p>
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
}
