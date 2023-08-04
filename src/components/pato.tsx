import Image from "next/image";

export default function PatoComponent({
  pato,
}: {
  pato: { imageUrl: string; id: string };
}) {
  return (
    <figure className="container mx-auto my-2 max-w-xs rounded-xl border-4 border-b-8 border-yellow-500 bg-yellow-300 p-6">
      <div className="mb-6 rounded-xl border-4 border-yellow-500">
        <Image
          className="mx-auto w-full rounded-lg bg-zinc-200"
          src={pato.imageUrl}
          alt="Un pato"
          width="360"
          height="360"
        />
      </div>
      <div className="flex flex-row justify-center gap-4">
        <button className="w-full rounded-xl border-b-4 border-red-600 bg-red-500 px-8  py-3 text-center font-bold text-white hover:border-red-500 hover:bg-red-400 focus:border-red-500 focus:bg-red-400 focus:outline-none focus:ring-4 focus:ring-red-300 active:border-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
            className="mx-auto h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        <button className="w-full rounded-xl border-b-4 border-green-600 bg-green-500  px-8 py-3 font-bold text-white hover:border-green-500 hover:bg-green-400 focus:border-green-500 focus:bg-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 active:border-0">
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
