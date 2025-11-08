import React, { useEffect, useRef } from "react";

interface WaveVisualizerProps {
  analyser?: AnalyserNode | null;
  simulatedLevel?: number; // 0..1 used when analyser not available
}

export { default } from "./interview/WaveVisualizer";
