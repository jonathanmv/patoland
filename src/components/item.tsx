import type { Item } from "@prisma/client";
import Image from "next/image";

export default function ItemComponent({ item }: { item: Item }) {
  return (
    <PatoImage imageSrc={item.imageUrl}>
      <div className="flex flex-row justify-center">
        <h1 className="text-center text-3xl font-bold text-yellow-900">
          {item.name}
        </h1>
      </div>
    </PatoImage>
  );
}

type PatoImageProps = {
  imageSrc: string;
  children: React.ReactNode;
};
function PatoImage({ imageSrc, children }: PatoImageProps) {
  return (
    <figure className="container mx-auto my-2 max-w-xs rounded-xl border-4 border-b-8 border-yellow-500 bg-yellow-300 p-6">
      <div className="relative mb-6 aspect-[2/3] rounded-xl border-4 border-yellow-500">
        <Image
          src={imageSrc}
          alt="pato"
          width={480}
          height={720}
          className="absolute h-full w-full rounded-lg bg-zinc-200 object-cover"
        />
      </div>
      <div className="flex flex-row justify-center gap-4">{children}</div>
    </figure>
  );
}
