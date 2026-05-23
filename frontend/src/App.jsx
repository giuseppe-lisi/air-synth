import React, { useEffect, useRef } from "react";

export default function App() {
  const videoRef = useRef(null);

  // requests access to webcam and opens camera on page load
  useEffect(() => {
    let webcam = null;

    const getCameraFeed = async () => {
      try {
        let stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 800, height: 600, frameRate: { ideal: 30 } },
          audio: false,
        });

        videoRef.current.srcObject = stream;
        webcam = stream;
      } catch (error) {
        console.log("Could not activate webcam feed:", error.message);
      }
    };

    getCameraFeed();

    // cleanup video streams on component unmount
    return () => {
      if (webcam) {
        webcam.getTracks().forEach((track) => {
          track.stop();
        });
        console.log("Webcam unmounted");
      }
    };
  }, []);

  return (
    <>
      <div className="app">
        <video ref={videoRef} autoPlay playsInline muted/>
        <div>
          <h3>synth params</h3>
          <p>param</p>
          <p>param</p>
          <p>param</p>
          <p>param</p>
          <p>param</p>
        </div>
      </div>
    </>
  );
}
