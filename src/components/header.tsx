import Link from "next/link";
import { UploadButton } from "~/utils/uploadthing";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-sky-500 to-cyan-400 p-4">
      <div className="flex flex-row justify-between">
        <Link href="/">
          <h1 className=" flex-grow text-5xl font-extrabold tracking-tight text-slate-800 sm:text-[3rem]">
            Patoland
          </h1>
        </Link>
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
    </header>
  );
}
