const peakCache = new Map<string, Promise<number[] | null>>();

const computePeaks = (buffer: AudioBuffer, peakCount: number) => {
  const channelCount = buffer.numberOfChannels;
  const samplesPerPeak = Math.max(1, Math.floor(buffer.length / peakCount));
  const peaks = new Array<number>(Math.ceil(buffer.length / samplesPerPeak)).fill(0);

  for (let channel = 0; channel < channelCount; channel += 1) {
    const channelData = buffer.getChannelData(channel);
    for (let peakIndex = 0; peakIndex < peaks.length; peakIndex += 1) {
      const start = peakIndex * samplesPerPeak;
      const end = Math.min(start + samplesPerPeak, channelData.length);
      let peak = 0;

      for (let i = start; i < end; i += 1) {
        const value = Math.abs(channelData[i]);
        if (value > peak) peak = value;
      }

      if (peak > peaks[peakIndex]) {
        peaks[peakIndex] = peak;
      }
    }
  }

  return peaks;
};

export const loadAudioPeaks = async (
  src: string,
  peakCount = 2048
): Promise<number[] | null> => {
  const existing = peakCache.get(src);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const response = await fetch(src);
      if (!response.ok) return null;

      const arrayBuffer = await response.arrayBuffer();
      const AudioContextCtor =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextCtor) return null;

      const audioContext = new AudioContextCtor();
      const buffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));

      try {
        await audioContext.close();
      } catch {
        /* ignore */
      }

      return computePeaks(buffer, peakCount);
    } catch {
      return null;
    }
  })();

  peakCache.set(src, promise);
  return promise;
};