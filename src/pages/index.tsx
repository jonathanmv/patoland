import { useRouter } from "next/router";
import PatoComponent from "~/components/pato";
import { api } from "~/utils/api";

export default function Home() {
  const { data: patos } = api.patos.getAll.useQuery();
  const router = useRouter();

  const onShare = ({ id }: { id: string }) => {
    if (!navigator.share) {
      console.log("Not supported");
      void router.push("/pato/" + id);
      return;
    }

    void navigator.share({
      title: "Pato",
      text: "Pato",
      url: window.location.href,
    });
  };

  return (
    <div className="flex flex-col gap-12">
      {patos?.map((pato) => (
        // <Link key={pato.id} href={`/pato/${pato.id}`}>
        <PatoComponent
          key={pato.id}
          pato={pato}
          onLove={(pato) => void router.push(`/pato/` + pato.id)}
          onShare={onShare}
        />
        // </Link>
      ))}
    </div>
  );
}
