// gets access to camera on page load
const getWebcam = async () => {
  try {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 800, height: 600, frameRate: { ideal: 30 } },
      audio: false,
    });
    return stream;
  } catch (error) {
    console.log("Could not activate webcam feed:", error.message);
  }
};

export { getWebcam };
