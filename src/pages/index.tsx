import PatoComponent from "~/components/pato";
import PatoLoading from "~/components/pato-loading";
import { api } from "~/utils/api";

export default function Home() {
  const { data: patos } = api.patos.getAll.useQuery();

  return (
    <>
      <div className="my-4 flex flex-col gap-12">
        {patos?.map((pato) => (
          <PatoComponent key={pato.id} pato={pato} />
        ))}
      </div>
      <PatoLoading />
    </>
  );
}
