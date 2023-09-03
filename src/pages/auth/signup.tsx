import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";

type Credentials = {
  username: string;
  password: string;
};

export default function SignUp() {
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });
  const router = useRouter();

  const signUp = api.auth.signUp.useMutation({
    onSettled: () => {
      setIsSigningUp(false);
    },
    onError: (error) => {
      alert(error.message);
    },
    onSuccess: async () => {
      await signIn("credentials", { ...credentials, redirect: false });
      await router.push("/");
    },
  });
  function handleSignUp({ username, password }: Credentials) {
    if (isSigningUp) return;

    setCredentials({ username, password });
    signUp.mutate({ username, password });
    setIsSigningUp(true);
  }

  return <SignUpComponent onSignUp={handleSignUp} isSigningUp={isSigningUp} />;
}

function SignUpComponent({
  onSignUp,
  isSigningUp,
}: {
  onSignUp: (credentials: Credentials) => void;
  isSigningUp?: boolean;
}) {
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = (formData.get("username") as string).toLocaleLowerCase();
    const password = formData.get("password") as string;
    const passwordTwo = formData.get("validate-password") as string;
    if (password !== passwordTwo) {
      alert("Las contraseñas no coinciden");
      return;
    }

    onSignUp({ username, password });
  }

  return (
    <form onSubmit={onSubmit}>
      <figure className="container mx-auto my-2 max-w-xs rounded-xl border-4 border-b-8 border-yellow-500 bg-yellow-300 p-6">
        <label
          htmlFor="username"
          className="mb-4 block text-3xl font-bold text-yellow-900"
        >
          usuario
          <input
            id="username"
            name="username"
            type="text"
            autoCapitalize="none"
            minLength={4}
            maxLength={20}
            className="form-input my-2 w-full rounded-xl border-4 border-yellow-500 bg-yellow-50 px-4 py-3 text-3xl lowercase"
            required
            pattern="^[a-zA-Z0-9_]{4,20}$"
          />
        </label>
        <label
          htmlFor="password"
          className="mb-4 block text-3xl font-bold text-yellow-900"
        >
          contraseña
          <input
            id="password"
            name="password"
            type="password"
            minLength={6}
            maxLength={50}
            required
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}"
            className="form-input my-2 w-full rounded-xl border-4 border-yellow-500 bg-yellow-50 px-4 py-3 text-3xl"
          />
          <p className="p-2 font-sans text-base font-normal leading-normal">
            Al menos 6 caracteres, una mayúscula, una minúscula y un número
          </p>
        </label>
        <label
          htmlFor="password"
          className="mb-4 block text-3xl font-bold text-yellow-900"
        >
          repetir contraseña
          <input
            id="validate-password"
            name="validate-password"
            type="password"
            minLength={6}
            maxLength={50}
            required
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}"
            className="form-input my-2 w-full rounded-xl border-4 border-yellow-500 bg-yellow-50 px-4 py-3 text-3xl"
          />
        </label>
        {!isSigningUp && (
          <button
            type="submit"
            className=" font-patoland my-4 w-full rounded-xl border-b-4 border-green-600 bg-green-500 px-8  py-3 text-3xl font-bold text-white hover:border-green-500 hover:bg-green-400 focus:border-green-500 focus:bg-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 active:border-0"
          >
            crear cuenta
          </button>
        )}
        {isSigningUp && (
          <button className="w-full rounded-xl border-0 border-b-4 border-violet-600 bg-violet-500 px-8 py-4 text-center font-bold text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
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
        )}
      </figure>
      <div className="container mx-auto mt-8 max-w-xs py-4">
        <Link href="/auth/signin">
          <button className="flex w-full transform flex-row items-center justify-center gap-4 rounded-xl border-b-4 border-blue-600 bg-blue-500 px-8 py-3  text-center font-bold text-white transition-transform hover:border-blue-500 hover:bg-blue-400 focus:border-blue-500 focus:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 active:border-0 active:border-t-4">
            <span className="font-patoland text-3xl">usar tu cuenta</span>
          </button>
        </Link>
      </div>
    </form>
  );
}
