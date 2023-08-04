import Link from "next/link";
import PatoComponent from "~/components/pato";
import { api } from "~/utils/api";

export default function Home() {
  const { data: patos } = api.patos.getAll.useQuery();

  return (
    <div className="flex flex-col items-center justify-center gap-12">
      {patos?.map((pato) => (
        <Link key={pato.id} href={`/pato/${pato.id}`}>
          <PatoComponent pato={pato} />
        </Link>
      ))}
    </div>
  );
}
