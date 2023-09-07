import Link from "next/link";
import { useRouter } from "next/router";
import ItemComponent from "~/components/item";
import PatoLoading from "~/components/pato-loading";
import { api } from "~/utils/api";

export default function Item() {
  const id = useRouter().query.id as string;

  const { data: item } = api.item.findById.useQuery(id, {
    enabled: !!id,
  });

  if (!item) {
    return <PatoLoading />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-12">
      <ItemComponent item={item} />
      <div className="container mx-auto mt-12 max-w-xs">
        <Link href={`/user/${item.userId}/items`}>
          <button className="flex w-full transform flex-row items-center justify-center gap-4 rounded-xl border-b-4 border-red-600 bg-red-500 px-8 py-3  text-center font-bold text-white transition-transform hover:border-red-500 hover:bg-red-400 focus:border-red-500 focus:bg-red-400 focus:outline-none focus:ring-4 focus:ring-red-300 active:border-0 active:border-t-4">
            <span className="font-patoland text-3xl">all items</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
              />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
}
