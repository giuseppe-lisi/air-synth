import VideoFeedComponent from "./components/VideoFeedComponent";
import SynthComponent from "./components/SynthComponent";
import { useEffect, useState } from "react";

export default function App() {
    return (
        <>
            <div className="flex">
                <VideoFeedComponent />
                <SynthComponent />
            </div>
        </>
    );
}
