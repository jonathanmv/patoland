import { useSession } from "next-auth/react";
import ItemComponent from "~/components/item";
import PatoLoading from "~/components/pato-loading";
import { api } from "~/utils/api";

export default function Item() {
  const user = useSession().data?.user;

  const { data: items } = api.item.findAllByUserId.useQuery(user?.id || "", {
    enabled: !!user?.id,
  });

  return (
    <div className="flex flex-col items-center justify-center gap-12">
      <h1 className="text-center text-3xl font-bold text-yellow-900">
        {`${user?.username || ""}'s items`}
      </h1>
      {items?.map((item) => (
        <ItemComponent item={item} key={item.id} />
      ))}
      <PatoLoading />
    </div>
  );
}
