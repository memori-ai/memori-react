import React, { useEffect, useRef } from 'react';

const BAR_COUNT = 48;
const MIN_SCALE = 0.12;
const FRAME_INTERVAL_MS = 70;

export interface Props {
  stream?: MediaStream | null;
  label?: string;
}

/**
 * Scrolling volume bars for the live microphone stream.
 */
const AudioWave = ({ stream, label }: Props) => {
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const AudioContextClass =
      typeof window !== 'undefined'
        ? window.AudioContext || (window as any).webkitAudioContext
        : undefined;
    if (!stream || !AudioContextClass) return;

    const audioContext: AudioContext = new AudioContextClass();
    audioContext.resume().catch(() => {});
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);

    const samples = new Uint8Array(analyser.fftSize);
    const levels = new Array<number>(BAR_COUNT).fill(0);
    let lastFrame = 0;
    let frame = 0;

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      if (time - lastFrame < FRAME_INTERVAL_MS) return;
      lastFrame = time;

      analyser.getByteTimeDomainData(samples);
      let sum = 0;
      for (let i = 0; i < samples.length; i++) {
        const deviation = (samples[i] - 128) / 128;
        sum += deviation * deviation;
      }
      const level = Math.min(1, Math.sqrt(sum / samples.length) * 5);

      levels.shift();
      levels.push(level);
      barsRef.current.forEach((bar, i) => {
        if (bar) {
          bar.style.transform = `scaleY(${Math.max(MIN_SCALE, levels[i])})`;
        }
      });
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      source.disconnect();
      audioContext.close().catch(() => {});
    };
  }, [stream]);

  return (
    <div className="memori-audio-wave" role="img" aria-label={label}>
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <span
          key={i}
          ref={el => {
            barsRef.current[i] = el;
          }}
          className="memori-audio-wave--bar"
        />
      ))}
    </div>
  );
};

export default AudioWave;
