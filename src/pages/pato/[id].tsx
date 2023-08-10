/* eslint-disable @typescript-eslint/no-empty-function */
import { useRouter } from "next/router";
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

  return <PatoComponent pato={pato} onLove={() => {}} onShare={() => {}} />;
}
