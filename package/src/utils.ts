export const formatTime = (seconds: number) => {
  const isNegative = seconds < 0;
  const absSeconds = Math.abs(seconds);
  const hrs = Math.floor(absSeconds / 3600);
  const mins = Math.floor((absSeconds % 3600) / 60);
  const secs = Math.floor(absSeconds % 60);
  const formattedTime = hrs === 0 
    ? `${mins}:${String(secs).padStart(2, "0")}` 
    : `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  return isNegative ? `-${formattedTime}` : formattedTime;
};

export const updateRangeBackground = (
  ref: HTMLInputElement | null,
  defaultValue?: number,
  maxVal?: number
) => {
  if (ref) {
    if (defaultValue || defaultValue === 0) {
      ref.value = defaultValue.toString();
    }
    if (maxVal) {
      ref.max = maxVal.toString();
    } else if (!ref.max) {
      ref.max = "100";
    }
    const value = (parseFloat(ref.value) / parseFloat(ref.max)) * 100;
    ref.style.setProperty("--value", `${value}%`);
  }
};

export const getYouTubeVideoId = (url: string) => {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const isYouTubeUrl = (url: string) => {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
};

export const playbackRateOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];