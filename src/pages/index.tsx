import { Player } from "@lottiefiles/react-lottie-player";
import PatoComponent from "~/components/pato";
import { api } from "~/utils/api";

export default function Home() {
  const { data: patos } = api.patos.getAll.useQuery();

  return (
    <>
      <div className="flex flex-col gap-12">
        {patos?.map((pato) => (
          <PatoComponent key={pato.id} pato={pato} />
        ))}
      </div>

      <div className="container mx-auto mt-12 max-w-xs">
        <Player
          autoplay
          loop
          src="/pato-lottie.json"
          style={{ height: "300px", width: "300px" }}
        />
      </div>
    </>
  );
}
