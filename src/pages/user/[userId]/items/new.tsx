/* eslint-disable @next/next/no-img-element */
import type { Item } from "@prisma/client";
import "@uploadthing/react/styles.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { WebcamComponent } from "~/components/webcamComponent";
import { api } from "~/utils/api";
import { useUploadThing } from "~/utils/uploadthing";

export default function NewPato() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [item, setItem] = useState<Item | null>(null);
  const router = useRouter();

  const { data: session } = useSession();

  const saveItem = api.item.add.useMutation({
    onSuccess: (item) => {
      alert("Item saved!");
      setItem(item);
    },
    onError: (error) => {
      console.error(error);
      alert("Error saving item!");
    },
  });

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (file) => {
      if (!file || !file[0]) return;

      setUploadedImageUrl(file[0].fileUrl);
      saveItem.mutate({
        name: "Item",
        description: "Item description",
        imageUrl: file[0].fileUrl,
      });
    },
    onUploadError: (error) => {
      console.error(error);
      alert("Upload failed!");
      setImageSrc(null);
    },
  });

  const onConfirm = useCallback(async () => {
    if (!imageSrc) return;
    if (isUploading) return;

    const blob = await fetch(imageSrc).then((res) => res.blob());
    const file = new File([blob], "item.jpeg", { type: "image/jpeg" });
    await startUpload([file]);
  }, [imageSrc, isUploading, startUpload]);

  if (!session?.user) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-12">
      {imageSrc || item ? null : <WebcamComponent onCapture={setImageSrc} />}
      {imageSrc ? (
        <PatoImage imageSrc={item?.imageUrl || imageSrc}>
          {!item && !isUploading && !uploadedImageUrl ? (
            <Choose
              onConfirm={() => void onConfirm()}
              onReset={() => setImageSrc(null)}
            />
          ) : null}
          {isUploading ? <Uploading /> : null}
          {uploadedImageUrl && !item ? <Uploading /> : null}
          {item ? <Item item={item} /> : null}
        </PatoImage>
      ) : null}
    </div>
  );
}

type ItemProps = {
  item: Item;
};

function Item({ item }: ItemProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="rounded-lg border-4 border-blue-400 bg-blue-500 px-4 py-2 text-xl font-bold text-white">
        Item saved!
      </p>
    </div>
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
        <img
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

const Choose = ({
  onConfirm,
  onReset,
}: {
  onConfirm: () => void;
  onReset: () => void;
}) => (
  <>
    <button
      className="rounded-xl border-b-4 border-green-600 bg-green-500 px-8  py-3 text-center font-bold text-white hover:border-green-500 hover:bg-green-400 focus:border-green-500 focus:bg-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 active:border-0"
      onClick={onConfirm}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="mx-auto h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
    </button>
    <button
      className="rounded-xl border-b-4 border-red-600 bg-red-500 px-8  py-3 text-center font-bold text-white hover:border-red-500 hover:bg-red-400 focus:border-red-500 focus:bg-red-400 focus:outline-none focus:ring-4 focus:ring-red-300 active:border-0"
      onClick={onReset}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="mx-auto h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </>
);

const Uploading = () => (
  <>
    <button className="rounded-xl border-0 border-violet-600 bg-violet-500 px-8 py-3 text-center font-bold text-white outline-none ring-4 ring-violet-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="mx-auto h-6 w-6 animate-spin"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </button>
  </>
);
