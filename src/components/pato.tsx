import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
type Pato = { imageUrl: string; id: string; love: number };
type Props = {
  pato: Pato;
  onLove: (pato: Pato) => void;
  onShare: (pato: Pato) => void;
};

const useTrottledCallback = (callback: () => void, delay: number) => {
  const timeoutRef = useRef<number | null>(null);

  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      callbackRef.current();
    }, delay);
  }, [delay]);
};

export default function PatoComponent({ pato, onLove, onShare }: Props) {
  const [loveBuffer, setLoveBuffer] = useState(0);
  const addLove = api.patos.addLove.useMutation({
    onSuccess: () => {
      setLoveBuffer(0);
      onLove(pato);
    },
  });

  const pushLove = () => {
    addLove.mutate({ id: pato.id, love: loveBuffer });
  };

  const trottledOnLove = useTrottledCallback(pushLove, 1000);

  const handleLove = () => {
    setLoveBuffer((prev) => prev + 1);
    trottledOnLove();
  };

  return (
    <figure className="container mx-auto my-2 max-w-xs rounded-xl border-4 border-b-8 border-yellow-500 bg-yellow-300 p-6">
      <div className="relative mb-6 aspect-[2/3] rounded-xl border-4 border-yellow-500">
        <Image
          width={480}
          height={720}
          className="absolute h-full w-full rounded-lg bg-zinc-200 object-cover"
          src={pato.imageUrl}
          alt="pato"
        />
      </div>
      <div className="flex flex-row justify-center gap-4">
        <button
          onClick={handleLove}
          className="duration-50 w-full transform  rounded-xl border-b-4 border-red-600 bg-red-500 px-8 py-3  text-center font-bold text-white transition-transform hover:border-red-500 hover:bg-red-400 focus:border-red-500 focus:bg-red-400 focus:outline-none focus:ring-4 focus:ring-red-300 active:-translate-y-4 active:border-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="mx-auto h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        <button
          onClick={() => onShare(pato)}
          className="w-full rounded-xl border-b-4 border-green-600 bg-green-500  px-8 py-3 font-bold text-white hover:border-green-500 hover:bg-green-400 focus:border-green-500 focus:bg-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 active:border-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="mx-auto h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
        </button>
      </div>
    </figure>
  );
}
