export async function createMicrophoneAnalyser(audioContext: AudioContext) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0.8;
  source.connect(analyser);

  return { stream, source, analyser };
}

export function getAmplitudeFromAnalyser(analyser: AnalyserNode) {
  const data = new Uint8Array(analyser.fftSize / 2);
  analyser.getByteTimeDomainData(data);
  // compute RMS
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const v = (data[i] - 128) / 128;
    sum += v * v;
  }
  const rms = Math.sqrt(sum / data.length);
  return rms; // 0..1
}
