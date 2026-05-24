import { useEffect, useState } from "react";
import VideoFeedComponent from "../components/VideoFeedComponent";
import { useParametersStore } from "../store/useParametersStore";
import * as Tone from "tone";

export default function App() {
  const { cutoff } = useParametersStore();

  return (
    <>
      <div className="flex">
        <VideoFeedComponent />
        <div className="p-6">
          <h3>Parameters</h3>
          <p>Cutoff: {cutoff}</p>
        </div>
      </div>
    </>
  );
}
