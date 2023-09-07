/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import ItemComponent from "~/components/item";
import { api } from "~/utils/api";

export default function Item() {
  const id = useRouter().query.id as string;

  const { data: item } = api.item.findById.useQuery(id, {
    enabled: !!id,
  });

  return (
    <div className="flex flex-col items-center justify-center gap-12">
      {item ? <ItemComponent item={item} /> : null}
    </div>
  );
}
