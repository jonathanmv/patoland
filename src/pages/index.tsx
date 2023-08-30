import { useSession } from "next-auth/react";
import PatoComponent from "~/components/pato";
import PatoLoading from "~/components/pato-loading";
import { api } from "~/utils/api";

export default function Home() {
  const { data: patos } = api.patos.getAll.useQuery();
  const { data } = useSession();

  return (
    <>
      <div className="flex flex-col gap-12">
        {data?.user ? `Hola ${data.user.username || ""}` : "No user"}
        {patos?.map((pato) => (
          <PatoComponent key={pato.id} pato={pato} />
        ))}
      </div>
      <PatoLoading />
    </>
  );
}
