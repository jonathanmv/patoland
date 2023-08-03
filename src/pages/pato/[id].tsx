import { useRouter } from "next/router";
import TopBar from "~/components/header";
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
    <main>
      <TopBar />
      <PatoComponent pato={pato} />
    </main>
  );
}
