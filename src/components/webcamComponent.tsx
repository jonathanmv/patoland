import { useCallback, useRef, useState, type SyntheticEvent } from "react";
import Webcam from "react-webcam";

type WebcamProps = {
  onCapture: (imageSrc: string) => void;
};
export function WebcamComponent({ onCapture }: WebcamProps) {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<SyntheticEvent<
    HTMLVideoElement,
    Event
  > | null>(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      return alert("No image");
    }
    onCapture(imageSrc);
  }, [onCapture]);

  return (
    <figure className="container mx-auto my-2 max-w-xs rounded-xl border-4 border-b-8 border-yellow-500 bg-yellow-300 p-6">
      <div className="relative mb-6 aspect-[2/3] rounded-xl border-4 border-yellow-500">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <p className="text-xl font-bold text-red-500">Error</p>
            <p className="text-xl font-bold text-red-500">
              {error?.type || "Unknown error"}
            </p>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </div>
        ) : null}
        {error ? null : (
          <Webcam
            imageSmoothing
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            audio={false}
            videoConstraints={{
              height: { min: 720, ideal: 1080, max: 1440 },
              width: { min: 480, ideal: 720, max: 960 },
              facingMode: "environment",
            }}
            forceScreenshotSourceSize
            width={480}
            height={720}
            className="absolute h-full w-full rounded-lg bg-zinc-200 object-cover"
            onError={setError}
          />
        )}
      </div>
      <div className="flex flex-row justify-center gap-4">
        <button
          className="rounded-xl border-b-4 border-violet-600 bg-violet-500 px-8  py-3 text-center font-bold text-white hover:border-violet-500 hover:bg-violet-400 focus:border-violet-500 focus:bg-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-300 active:border-0"
          onClick={capture}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="mx-auto h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
            />
          </svg>
        </button>
      </div>
    </figure>
  );
}
