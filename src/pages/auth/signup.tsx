import { useState } from "react";
import { api } from "~/utils/api";

type Credentials = {
  username: string;
  password: string;
};

export default function SignUp() {
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const signUp = api.auth.signUp.useMutation({
    onSettled: () => {
      setIsSigningUp(false);
    },
    onError: (error) => {
      alert(error.message);
    },
    onSuccess: () => {
      alert("Cuenta creada exitosamente");
    },
  });
  function handleSignUp({ username, password }: Credentials) {
    signUp.mutate({ username, password });
    setIsSigningUp(true);
  }

  return (
    <div>
      {(isSigningUp && <>Signing in...</>) || <>Sign up</>}
      <SignUpComponent onSignUp={handleSignUp} />
    </div>
  );
}

function SignUpComponent({
  onSignUp,
}: {
  onSignUp: (credentials: Credentials) => void;
}) {
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
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
      <label htmlFor="username">Usuario</label>
      <input
        type="text"
        name="username"
        id="username"
        required
        pattern="^[a-zA-Z0-9_]{3,15}$"
      />
      <label htmlFor="password">Contraseña</label>
      <input
        type="password"
        name="password"
        id="password"
        minLength={6}
        maxLength={50}
        required
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}"
      />
      <label htmlFor="validate-password">Repetir Contraseña</label>
      <input
        type="password"
        name="validate-password"
        id="validate-password"
        minLength={6}
        maxLength={50}
        required
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}"
      />
      <button type="submit">Crear cuenta</button>
    </form>
  );
}
