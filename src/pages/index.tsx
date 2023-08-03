import Link from "next/link";
import TopBar from "~/components/header";
import PatoComponent from "~/components/pato";
import { api } from "~/utils/api";

export default function Home() {
  const { data: patos } = api.patos.getAll.useQuery();

  return (
    <>
      <main className="">
        <TopBar />
        <div className="flex flex-col items-center justify-center gap-20">
          {patos?.map((pato) => (
            <Link key={pato.id} href={`/pato/${pato.id}`}>
              <PatoComponent pato={pato} />
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
