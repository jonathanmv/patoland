import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken } from "next-auth/react";
import Link from "next/link";

export default function SignIn({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <form method="post" action="/api/auth/callback/credentials">
      <figure className="font-patoland container mx-auto my-2 max-w-xs rounded-xl border-4 border-b-8 border-yellow-500 bg-yellow-300 p-6">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label
          htmlFor="username"
          className="mb-4 block text-2xl font-bold text-yellow-950"
        >
          Usuario
          <input
            id="username"
            name="username"
            type="text"
            className="form-input w-full rounded-xl border-4 border-yellow-500 bg-yellow-50 px-4 py-3 text-4xl"
          />
        </label>
        <label
          htmlFor="password"
          className="mb-4 block text-2xl font-bold text-yellow-950"
        >
          Contrase<span className="text-base">ñ</span>a
          <input
            id="password"
            name="password"
            type="password"
            className="form-input w-full rounded-xl border-4 border-yellow-500 bg-yellow-50 px-4 py-3 text-4xl"
          />
        </label>
        <button
          type="submit"
          className="font-patoland my-4 w-full rounded-xl border-b-4 border-green-600 bg-green-500 px-8  py-3 text-3xl font-bold text-white hover:border-green-500 hover:bg-green-400 focus:border-green-500 focus:bg-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 active:border-0"
        >
          entrar
        </button>
      </figure>
      <div className="container mx-auto mt-12 max-w-xs">
        <Link href="/auth/sigup">
          <button className="flex w-full transform flex-row items-center justify-center gap-4 rounded-xl border-b-4 border-blue-600 bg-blue-500 px-8 py-3  text-center font-bold text-white transition-transform hover:border-blue-500 hover:bg-blue-400 focus:border-blue-500 focus:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 active:border-0 active:border-t-4">
            <span className="font-patoland text-3xl">abrir nueva cuenta</span>
          </button>
        </Link>
      </div>
    </form>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
