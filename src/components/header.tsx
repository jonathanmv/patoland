import Link from "next/link";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full px-4 py-2">
      <div className="flex flex-row items-center justify-between">
        <Link href="/">
          <h1 className="font-patoland text-[4rem] font-extrabold text-slate-700">
            patoland
          </h1>
        </Link>
        <Link href="/new" className="relative">
          <span className="absolute h-full w-full rounded-xl border-b-4 border-violet-600 bg-violet-500 px-8 py-3  text-center font-bold text-white opacity-75 hover:border-violet-500 hover:bg-violet-400 focus:border-violet-500 focus:bg-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-300 active:border-0" />
          <button className="animate-pulse rounded-xl border-b-4 border-violet-600 bg-violet-500 px-8 py-3  text-center font-bold text-white hover:border-violet-500 hover:bg-violet-400 focus:border-violet-500 focus:bg-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-300 active:border-0">
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
        </Link>
      </div>
    </header>
  );
}
