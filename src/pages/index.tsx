import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";
import { UploadButton } from "~/utils/uploadthing";

export default function Home() {
  const { data: patos } = api.patos.getAll.useQuery();
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Patos
          </h1>
          <ul>
            {patos?.map((pato) => (
              <li key={pato.id}>
                <Link href={`/patos/${pato.id}`}>
                  <Image
                    src={pato.imageUrl}
                    alt={pato.name}
                    width="512"
                    height="512"
                  />
                  <div className="text-slate-200">{pato.name}</div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center gap-2">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                console.log("Files: ", res);
                alert("Upload Completed");
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
}