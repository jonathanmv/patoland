import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: { maxFileSize: "512KB", maxFileCount: 1 },
  }).onUploadComplete(({ metadata, file }) => {
    console.log("Uploaded image", metadata, file);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
