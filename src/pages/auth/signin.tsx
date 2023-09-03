import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignIn() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const username = (formData.get("username") as string).toLocaleLowerCase();
    const password = formData.get("password") as string;
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setError("combinación incorrecta");
    } else {
      await router.push("/");
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)}>
      <figure className="container mx-auto my-2 max-w-xs rounded-xl border-4 border-b-8 border-yellow-500 bg-yellow-300 p-6">
        <label
          htmlFor="username"
          className="mb-4 block text-2xl font-extrabold text-yellow-950"
        >
          usuario
          <input
            id="username"
            name="username"
            autoCapitalize="none"
            type="text"
            className="form-input my-2 w-full rounded-xl border-4 border-yellow-500 bg-yellow-50 px-4 py-3 text-3xl lowercase"
          />
        </label>
        <label
          htmlFor="password"
          className="mb-4 block text-2xl font-bold text-yellow-950"
        >
          contraseña
          <input
            id="password"
            name="password"
            type="password"
            className="form-input my-2 w-full rounded-xl border-4 border-yellow-500 bg-yellow-50 px-4 py-3 text-3xl"
          />
        </label>
        {error && (
          <p className="mb-4 text-center text-xl font-bold text-red-500">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="font-patoland my-4 w-full rounded-xl border-b-4 border-green-600 bg-green-500 px-8  py-3 text-3xl font-bold text-white hover:border-green-500 hover:bg-green-400 focus:border-green-500 focus:bg-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 active:border-0"
        >
          entrar
        </button>
      </figure>
      <div className="container mx-auto mt-8 max-w-xs py-4">
        <Link href="/auth/signup">
          <button className="flex w-full transform flex-row items-center justify-center gap-4 rounded-xl border-b-4 border-blue-600 bg-blue-500 px-8 py-3  text-center font-bold text-white transition-transform hover:border-blue-500 hover:bg-blue-400 focus:border-blue-500 focus:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 active:border-0 active:border-t-4">
            <span className="font-patoland text-3xl">abrir cuenta nueva</span>
          </button>
        </Link>
      </div>
    </form>
  );
}
