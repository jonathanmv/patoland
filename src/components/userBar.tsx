import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function HeaderBar() {
  const user = useSession()?.data?.user;
  const router = useRouter();

  const handleClick = () => {
    const out = confirm("¿Quieres salir?");
    if (out) {
      void signOut({ callbackUrl: "/" });
    }
  };

  if (!user) {
    return null;
  }

  if (router.pathname !== "/") {
    return null;
  }

  return (
    <div className="flex w-full flex-row items-center justify-between px-4">
      <button
        className="font-patoland text-[2rem] font-bold text-slate-700"
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className="inline h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>

        <span className="mx-2">{user.name || user.username}</span>
      </button>
    </div>
  );
}
