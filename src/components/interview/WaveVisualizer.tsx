import React, { useEffect, useRef } from "react";

interface WaveVisualizerProps {
  analyser?: AnalyserNode | null;
  simulatedLevel?: number; // 0..1 used when analyser not available
}

export const WaveVisualizer: React.FC<WaveVisualizerProps> = ({ analyser = null, simulatedLevel = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;

    function draw() {
      const w = canvas.width = canvas.clientWidth * devicePixelRatio;
      const h = canvas.height = canvas.clientHeight * devicePixelRatio;
      ctx.clearRect(0, 0, w, h);

      const barCount = 36;
      let level = simulatedLevel;
      if (analyser) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        level = Math.min(1, (sum / (data.length * 255)) * 2);
      }

      for (let i = 0; i < barCount; i++) {
        const x = (i / barCount) * w;
        const barH = (Math.sin(i + Date.now() / 200) * 0.5 + 0.5) * level * h * 0.9;
        const hue = 195; // neon blue
        ctx.fillStyle = `hsl(${hue} 100% ${Math.max(50, 60 * (level + 0.2))}% / ${0.9})`;
        const bw = w / barCount * 0.6;
        const by = h - barH;
        ctx.fillRect(x, by, bw, barH);
      }

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, [analyser, simulatedLevel]);

  return <canvas ref={canvasRef} className="w-full h-12 block" />;
};

export default WaveVisualizer;
