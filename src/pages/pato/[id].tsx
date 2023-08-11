/* eslint-disable @typescript-eslint/no-empty-function */
import Link from "next/link";
import { useRouter } from "next/router";
import PatoComponent from "~/components/pato";
import { api } from "~/utils/api";

export default function Pato() {
  const id = useRouter().query.id as string;

  const { data: pato } = api.patos.findById.useQuery(id, {
    enabled: !!id,
  });

  if (!pato) {
    return null;
  }

  return (
    <div>
      <PatoComponent pato={pato} onLove={() => {}} onShare={() => {}} />
      <div className="container mx-auto mt-12 max-w-xs">
        <Link href={`/`}>
          <button className="flex w-full transform flex-row items-center justify-center gap-4 rounded-xl border-b-4 border-red-600 bg-red-500 px-8 py-3  text-center font-bold text-white transition-transform hover:border-red-500 hover:bg-red-400 focus:border-red-500 focus:bg-red-400 focus:outline-none focus:ring-4 focus:ring-red-300 active:border-0 active:border-t-4">
            <span className="font-patoland text-3xl">patoland</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
              />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
}
