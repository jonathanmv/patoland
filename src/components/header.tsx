import Link from "next/link";
import { UploadButton } from "~/utils/uploadthing";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full px-4 py-2">
      <div className="flex flex-row justify-between">
        <Link href="/">
          <h1 className="font-patoland text-[4rem] font-extrabold text-slate-700">
            patoland
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
