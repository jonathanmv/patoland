import { type PatosWithoutUser } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
type Pato = PatosWithoutUser;
type Props = {
  pato: Pato;
  onLove?: (pato: Pato) => void;
  onShare?: (pato: Pato) => void;
};

const Heart = ({ number, animated }: { animated?: boolean; number: number }) =>
  animated ? (
    <div
      className={
        "absolute flex h-full w-full items-center justify-center bg-red-200 opacity-75"
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="red"
        viewBox="0 0 24 24"
        strokeWidth="2.5"
        stroke="red"
        className={"duration-50 mx-auto h-1/2 w-1/2 animate-ping"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      <span className="absolute text-4xl font-bold text-white">{number}</span>
    </div>
  ) : null;

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

export default function PatoComponent({ pato, onLove }: Props) {
  const [addedLove, setAddedLove] = useState(0);
  const [loveBuffer, setLoveBuffer] = useState(0);
  const currentLove = loveBuffer + pato.love + addedLove;
  const addLove = api.patos.addLove.useMutation({
    onSuccess: () => {
      setAddedLove((prev) => prev + loveBuffer);
      setLoveBuffer(0);
      onLove && onLove({ ...pato, love: currentLove });
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

  // SHARE
  const [isSharing, setIsSharing] = useState(false);
  const handleShare = () => {
    if (!navigator.share) {
      setIsSharing(true);
      return;
    }

    void navigator.share({
      title: "Pato",
      text: "Descubre un mundo de patos",
      url: `${window.location.origin}/pato/${pato.id}`,
    });
  };

  return (
    <figure className="container mx-auto my-2 max-w-xs rounded-xl border-4 border-b-8 border-yellow-500 bg-yellow-300 p-6">
      {isSharing ? (
        <SharePato pato={pato} onClose={() => setIsSharing(false)} />
      ) : null}
      <div
        onClick={handleLove}
        className="relative mb-6 aspect-[2/3] select-none rounded-xl border-4 border-yellow-500"
      >
        <Image
          width={480}
          height={720}
          className="absolute h-full w-full rounded-lg bg-zinc-200 object-cover"
          src={pato.imageNoBgUrl || pato.imageUrl}
          alt="pato"
        />
        <Heart number={currentLove} animated={loveBuffer > 0} />
      </div>
      <div className="flex flex-row justify-center gap-4">
        <button
          onClick={handleLove}
          className="flex w-full transform flex-row  rounded-xl border-b-4 border-red-600 bg-red-500 px-8 py-3  text-center font-bold text-white transition-transform hover:border-red-500 hover:bg-red-400 focus:border-red-500 focus:bg-red-400 focus:outline-none focus:ring-4 focus:ring-red-300 active:border-0 active:border-t-4"
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
          {currentLove}
        </button>

        <button
          onClick={handleShare}
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

const SharePato = ({ pato, onClose }: { pato: Pato; onClose: () => void }) => {
  const patoUrl = `${window.location.origin}/pato/${pato.id}`;
  const shareText = `Patoland
Descubre un mundo de patos

${patoUrl}`;
  const encodedText = encodeURIComponent(shareText);
  const copyToClipboard = () => {
    void navigator.clipboard.writeText(patoUrl);
  };
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end">
      <div
        className="absolute inset-0 bg-green-50 opacity-75"
        onClick={onClose}
      ></div>
      <div className="relative m-4 w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 flex w-full flex-row items-end justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border-b-4 border-slate-400 bg-slate-300 px-8  py-3 font-bold text-white  hover:border-slate-300 hover:bg-slate-200 focus:border-slate-300 focus:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-100 active:border-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col items-center justify-stretch space-y-4">
          <button className="w-full rounded-xl border-b-4 border-green-600 bg-green-500 px-8  py-3 font-bold text-white hover:border-green-500 hover:bg-green-400 focus:border-green-500 focus:bg-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 active:border-0">
            <a
              href={`https://wa.me/?text=${encodedText}`}
              target="_blank"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="24"
                height="24"
                viewBox="0 0 50 50"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mx-auto h-8 w-8"
                fill="white"
              >
                <path d="M 25 2 C 12.3 2 2 12.3 2 25 C 2 29.1 3.1 32.899219 5 36.199219 L 2 46.699219 C 1.9 46.999219 1.9992187 47.399219 2.1992188 47.699219 C 2.4992187 47.999219 2.8992187 48 3.1992188 48 L 14.199219 45.300781 C 17.399219 47.000781 21.1 48 25 48 C 37.7 48 48 37.7 48 25 C 48 12.3 37.7 2 25 2 z M 25 4 C 36.6 4 46 13.4 46 25 C 46 36.6 36.6 46 25 46 C 21.3 46 17.800781 45.000781 14.800781 43.300781 C 14.600781 43.200781 14.299609 43.099219 14.099609 43.199219 L 4.5 45.599609 L 7 36.400391 C 7.1 36.100391 7.0003906 35.899609 6.9003906 35.599609 C 5.1003906 32.499609 4 28.9 4 25 C 4 13.4 13.4 4 25 4 z M 18.113281 12.988281 C 17.925781 12.975781 17.800781 13 17.800781 13 L 16.599609 13 C 15.999609 13 15.100781 13.2 14.300781 14 C 13.800781 14.5 12 16.3 12 19.5 C 12 22.9 14.299609 25.799609 14.599609 26.099609 C 14.599609 26.099609 15 26.600781 15.5 27.300781 C 16 28.000781 16.699609 28.800781 17.599609 29.800781 C 19.399609 31.700781 21.899609 33.899219 25.099609 35.199219 C 26.499609 35.799219 27.699609 36.2 28.599609 36.5 C 30.199609 37 31.700781 36.900781 32.800781 36.800781 C 33.600781 36.700781 34.500391 36.299219 35.400391 35.699219 C 36.300391 35.099219 37.199609 34.400391 37.599609 33.400391 C 37.899609 32.600391 37.999609 31.900781 38.099609 31.300781 L 38.099609 30.5 C 38.099609 30.2 38.000781 30.200781 37.800781 29.800781 C 37.300781 29.000781 36.799219 29.000781 36.199219 28.800781 C 35.899219 28.600781 34.999219 28.200781 34.199219 27.800781 C 33.299219 27.400781 32.599609 27.000781 32.099609 26.800781 C 31.799609 26.700781 31.400391 26.499609 30.900391 26.599609 C 30.400391 26.699609 29.899609 27 29.599609 27.5 C 29.299609 27.9 28.200781 29.299219 27.800781 29.699219 L 27.699219 29.599609 C 27.299219 29.399609 26.7 29.200781 26 28.800781 C 25.2 28.400781 24.299219 27.800781 23.199219 26.800781 C 21.599219 25.400781 20.499219 23.699609 20.199219 23.099609 C 20.499219 22.699609 20.899609 22.3 21.099609 22 C 21.199609 21.9 21.280859 21.799219 21.349609 21.699219 C 21.418359 21.599219 21.475391 21.500391 21.525391 21.400391 C 21.625391 21.200391 21.700781 21.000781 21.800781 20.800781 C 22.200781 20.100781 22.000781 19.300391 21.800781 18.900391 C 21.800781 18.900391 21.7 18.600781 21.5 18.300781 C 21.4 18.000781 21.2 17.499609 21 17.099609 C 20.6 16.199609 20.2 15.199609 20 14.599609 C 19.7 13.899609 19.300781 13.399219 18.800781 13.199219 C 18.550781 13.049219 18.300781 13.000781 18.113281 12.988281 z M 16.599609 15 L 17.699219 15 L 17.900391 15 C 17.900391 15 17.999609 15.100391 18.099609 15.400391 C 18.299609 16.000391 18.799609 17.000391 19.099609 17.900391 C 19.299609 18.300391 19.499609 18.799609 19.599609 19.099609 C 19.699609 19.399609 19.800391 19.600781 19.900391 19.800781 C 19.900391 19.900781 20 19.900391 20 19.900391 C 19.8 20.300391 19.8 20.399219 19.5 20.699219 C 19.2 21.099219 18.799219 21.499219 18.699219 21.699219 C 18.599219 21.899219 18.299609 22.1 18.099609 22.5 C 17.899609 22.9 18.000781 23.599609 18.300781 24.099609 C 18.700781 24.699609 19.900781 26.700391 21.800781 28.400391 C 23.000781 29.500391 24.1 30.199609 25 30.599609 C 25.9 31.099609 26.600781 31.300391 26.800781 31.400391 C 27.200781 31.600391 27.599609 31.699219 28.099609 31.699219 C 28.599609 31.699219 29.000781 31.3 29.300781 31 C 29.700781 30.6 30.699219 29.399609 31.199219 28.599609 L 31.400391 28.699219 C 31.400391 28.699219 31.699609 28.8 32.099609 29 C 32.499609 29.2 32.900391 29.399609 33.400391 29.599609 C 34.300391 29.999609 35.100391 30.399609 35.400391 30.599609 L 36 30.900391 L 36 31.199219 C 36 31.599219 35.899219 32.200781 35.699219 32.800781 C 35.599219 33.100781 35.000391 33.699609 34.400391 34.099609 C 33.700391 34.499609 32.899609 34.800391 32.599609 34.900391 C 31.699609 35.000391 30.600781 35.099219 29.300781 34.699219 C 28.500781 34.399219 27.4 34.1 26 33.5 C 23.2 32.3 20.899219 30.3 19.199219 28.5 C 18.399219 27.6 17.699219 26.799219 17.199219 26.199219 C 16.699219 25.599219 16.500781 25.2 16.300781 25 C 15.900781 24.6 14 21.999609 14 19.599609 C 14 17.099609 15.200781 16.100391 15.800781 15.400391 C 16.100781 15.000391 16.499609 15 16.599609 15 z"></path>
              </svg>
            </a>
          </button>
          <Link
            href={`/pato/${pato.id}`}
            onClick={copyToClipboard}
            className="w-full"
          >
            <button
              className="w-full rounded-xl border-b-4 border-green-600 bg-green-500 px-8  py-3 font-bold text-white hover:border-green-500 hover:bg-green-400 focus:border-green-500 focus:bg-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 active:border-0"
              onClick={copyToClipboard}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                strokeWidth={2.5}
                stroke="currentColor"
                className="mx-auto h-8 w-8"
                fill="none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
