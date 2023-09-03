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
  const router = useRouter();
  const signUp = api.auth.signUp.useMutation({
    onSettled: () => {
      setIsSigningUp(false);
    },
    onError: (error) => {
      alert(error.message);
    },
    onSuccess: () => {
      alert("Cuenta creada exitosamente");
      void router.push("/");
    },
  });
  function handleSignUp({ username, password }: Credentials) {
    if (isSigningUp) return;

    signUp.mutate({ username, password });
    setIsSigningUp(true);
  }

  return <SignUpComponent onSignUp={handleSignUp} />;
}

function SignUpComponent({
  onSignUp,
}: {
  onSignUp: (credentials: Credentials) => void;
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
      <figure className="font-patoland container mx-auto my-2 max-w-xs rounded-xl border-4 border-b-8 border-yellow-500 bg-yellow-300 p-6">
        <label
          htmlFor="username"
          className="mb-4 block text-3xl font-bold text-yellow-900"
        >
          usuario
          <input
            id="username"
            name="username"
            type="text"
            minLength={4}
            maxLength={20}
            className="form-input w-full rounded-xl border-4 border-yellow-500 bg-yellow-50 px-4 py-3 text-4xl"
            required
            pattern="^[a-zA-Z0-9_]{4,20}$"
          />
        </label>
        <label
          htmlFor="password"
          className="mb-4 block text-3xl font-bold text-yellow-900"
        >
          contrase<span className="text-lg">ñ</span>a
          <input
            id="password"
            name="password"
            type="password"
            minLength={6}
            maxLength={50}
            required
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}"
            className="form-input w-full rounded-xl border-4 border-yellow-500 bg-yellow-50 px-4 py-3 text-4xl"
          />
          <p className="p-2 font-sans text-base font-normal leading-normal">
            Al menos 6 caracteres, una mayúscula, una minúscula y un número
          </p>
        </label>
        <label
          htmlFor="password"
          className="mb-4 block text-3xl font-bold text-yellow-900"
        >
          repetir contrase<span className="text-lg">ñ</span>a
          <input
            id="validate-password"
            name="validate-password"
            type="password"
            minLength={6}
            maxLength={50}
            required
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}"
            className="form-input w-full rounded-xl border-4 border-yellow-500 bg-yellow-50 px-4 py-3 text-4xl"
          />
        </label>
        <button
          type="submit"
          className="font-patoland my-4 w-full rounded-xl border-b-4 border-green-600 bg-green-500 px-8  py-3 text-3xl font-bold text-white hover:border-green-500 hover:bg-green-400 focus:border-green-500 focus:bg-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 active:border-0"
        >
          crear cuenta
        </button>
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