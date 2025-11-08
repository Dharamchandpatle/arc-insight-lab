import { useEffect, useRef } from 'react';

const WaveBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationId;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create multiple wave layers
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);

        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 +
            Math.sin((x * 0.01) + time + (i * 2)) * 20 +
            Math.sin((x * 0.005) + time * 0.5 + (i * 1.5)) * 15;

          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `rgba(0, 191, 255, ${0.1 - i * 0.02})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      time += 0.05;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};

export default WaveBackground;