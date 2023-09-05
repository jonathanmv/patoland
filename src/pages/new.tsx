/* eslint-disable @next/next/no-img-element */
import type { Pato } from "@prisma/client";
import "@uploadthing/react/styles.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import Webcam from "react-webcam";
import { api } from "~/utils/api";
import { useUploadThing } from "~/utils/uploadthing";

export default function NewPato() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [pato, setPato] = useState<Pato | null>(null);
  const router = useRouter();

  const { data: session } = useSession();

  const savePato = api.patos.add.useMutation({
    onSuccess: (pato) => {
      setPato(pato);
      setTimeout(function waitUntilBgIsRemoved() {
        void router.push(`/pato/${pato.id}`);
      }, 3000);
    },
    onError: (error) => {
      console.error(error);
      alert("Error saving pato!");
    },
  });

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (file) => {
      if (!file || !file[0]) return;

      setUploaded(true);
      savePato.mutate({
        name: "Pato",
        imageUrl: file[0].fileUrl,
      });
    },
    onUploadError: (error) => {
      console.error(error);
      alert("Upload failed!");
      setImageSrc(null);
    },
  });

  const onConfirm = useCallback(async () => {
    if (!imageSrc) return;
    if (isUploading) return;

    const blob = await fetch(imageSrc).then((res) => res.blob());
    const file = new File([blob], "pato.jpeg", { type: "image/jpeg" });
    await startUpload([file]);
  }, [imageSrc, isUploading, startUpload]);

  useEffect(() => {
    if (!session) {
      void router.push("/auth/signin");
    }
  }, [router, session]);

  if (!session) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-12">
      {imageSrc || pato ? null : <WebcamComponent onCapture={setImageSrc} />}
      {imageSrc ? (
        <PatoImage imageSrc={pato?.imageNoBgUrl || pato?.imageUrl || imageSrc}>
          {!pato && !isUploading && !uploaded ? (
            <Choose
              onConfirm={() => void onConfirm()}
              onReset={() => setImageSrc(null)}
            />
          ) : null}
          {isUploading ? <Uploading /> : null}
          {uploaded || pato ? <RemovingBackground /> : null}
        </PatoImage>
      ) : null}
    </div>
  );
}

type WebcamProps = {
  onCapture: (imageSrc: string) => void;
};
function WebcamComponent({ onCapture }: WebcamProps) {
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

type PatoImageProps = {
  imageSrc: string;
  children: React.ReactNode;
};
function PatoImage({ imageSrc, children }: PatoImageProps) {
  return (
    <figure className="container mx-auto my-2 max-w-xs rounded-xl border-4 border-b-8 border-yellow-500 bg-yellow-300 p-6">
      <div className="relative mb-6 aspect-[2/3] rounded-xl border-4 border-yellow-500">
        <img
          src={imageSrc}
          alt="pato"
          width={480}
          height={720}
          className="absolute h-full w-full rounded-lg bg-zinc-200 object-cover"
        />
      </div>
      <div className="flex flex-row justify-center gap-4">{children}</div>
    </figure>
  );
}

const Choose = ({
  onConfirm,
  onReset,
}: {
  onConfirm: () => void;
  onReset: () => void;
}) => (
  <>
    <button
      className="rounded-xl border-b-4 border-green-600 bg-green-500 px-8  py-3 text-center font-bold text-white hover:border-green-500 hover:bg-green-400 focus:border-green-500 focus:bg-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 active:border-0"
      onClick={onConfirm}
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
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
    </button>
    <button
      className="rounded-xl border-b-4 border-red-600 bg-red-500 px-8  py-3 text-center font-bold text-white hover:border-red-500 hover:bg-red-400 focus:border-red-500 focus:bg-red-400 focus:outline-none focus:ring-4 focus:ring-red-300 active:border-0"
      onClick={onReset}
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
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </>
);

const Uploading = () => (
  <>
    <button className="rounded-xl border-0 border-violet-600 bg-violet-500 px-8 py-3 text-center font-bold text-white outline-none ring-4 ring-violet-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="mx-auto h-6 w-6 animate-spin"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </button>
  </>
);

const RemovingBackground = () => {
  const [counter, setCounter] = useState(3);
  useEffect(() => {
    if (counter <= 0) return;
    const timer = setTimeout(() => setCounter(counter - 1), 1000);
    return () => clearTimeout(timer);
  });

  return (
    <>
      <button className="rounded-xl border-0 border-violet-600 bg-violet-500 px-8 py-3 text-center font-bold text-white outline-none ring-4 ring-violet-300">
        <span className="text-2xl">{counter}</span>
      </button>
    </>
  );
};
