import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { prisma } from "./db";
import {
  removeImageBackground,
  type ReplicateCreatePredictionResponse,
} from "./replicate";

const f = createUploadthing();

// const auth = (req: NextApiRequest, res: NextApiResponse) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "512KB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    // .middleware(async ({ req, res }) => {
    //   // This code runs on your server before upload
    //   const user = await auth(req, res);

    //   // If you throw, the user will not be able to upload
    //   if (!user) throw new Error("Unauthorized");

    //   // Whatever is returned here is accessible in onUploadComplete as `metadata`
    //   return { userId: user.id };
    // })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete ...", metadata);

      const pato = await prisma.patosWithoutUser.create({
        data: {
          name: file.name,
          imageUrl: file.url,
        },
      });

      const prediction = await removeImageBackground(file.url);
      await savePrediction(pato.id, prediction);

      console.log(`Pato ${pato.id} saved at`, file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

function savePrediction(
  patoId: string,
  prediction: ReplicateCreatePredictionResponse
) {
  return prisma.patoPrediction.create({
    data: {
      id: prediction.id,
      version: prediction.version,
      status: prediction.status,
      created_at: prediction.created_at,
      error: prediction.error,
      patoId,
    },
  });
}
