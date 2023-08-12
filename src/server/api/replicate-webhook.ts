import type { NextApiRequest, NextApiResponse } from "next";
import { utapi } from "uploadthing/server";
import { z } from "zod";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prediction: unknown = req.body;
  if (!isValidReplicateGetPredictionRequest(prediction)) {
    console.error("Invalid prediction request", prediction);
    res.status(400).end();
    return;
  }

  await handlePrediction(prediction);

  res.status(200).end();
}

const replicateGetPredictionRequestSchema = z.object({
  id: z.string(),
  version: z.string(),
  urls: z.object({
    get: z.string(),
    cancel: z.string(),
  }),
  created_at: z.string(),
  started_at: z.string(),
  completed_at: z.string(),
  source: z.string(),
  status: z.string(),
  input: z.object({
    prompt: z.string(),
  }),
  output: z.string().or(z.array(z.string())),
  error: z.string().optional(),
  logs: z.string(),
  metrics: z.object({
    predict_time: z.number(),
  }),
});

type ReplicateGetPredictionRequest = z.infer<
  typeof replicateGetPredictionRequestSchema
>;

function isValidReplicateGetPredictionRequest(
  input: unknown
): input is ReplicateGetPredictionRequest {
  return replicateGetPredictionRequestSchema.safeParse(input).success;
}

type PredictionHandler = {
  version: string;
  handle: (prediction: ReplicateGetPredictionRequest) => Promise<void>;
};

async function handlePrediction(prediction: ReplicateGetPredictionRequest) {
  const handlers = predictionHandlers.filter(
    (h) => h.version === prediction.version
  );
  if (handlers.length === 0) {
    console.error("No handler for prediction", prediction);
    return;
  }

  try {
    await Promise.allSettled(handlers.map((h) => h.handle(prediction)));
  } catch (e) {
    console.error("Error handling prediction", prediction, e);
  }
}

const PatoWithoutBackgroundHandler: PredictionHandler = {
  version: "e809cddc666ccfd38a044f795cf65baab62eedc4273d096bf05935b9a3059b59",
  async handle(prediction) {
    if (prediction.status !== "succeeded") {
      console.log("Prediction not succeeded. Ignoring", prediction);
      return;
    }

    const patoPrediction = await prisma.patoPrediction.findUnique({
      where: { id: prediction.id },
    });

    if (!patoPrediction) {
      throw new Error("Pato prediction not found by id: " + prediction.id);
    }

    patoPrediction;
    if (patoPrediction.status === "succeeded") {
      console.log("prediction already handled", prediction);
      return;
    }

    const imageWithoutBackground = z
      .string()
      .parse(prediction.output || prediction.output[0]);
    const result = await utapi.uploadFilesFromUrl(imageWithoutBackground);
    if (result.error !== null) {
      console.error("Error uploading image without background", {
        prediction,
        result,
      });
      throw new Error("Error uploading image without background");
    }

    await prisma.$transaction([
      prisma.patosWithoutUser.update({
        where: { id: patoPrediction.patoId },
        data: {
          imageNoBgUrl: result.data.url,
        },
      }),
      prisma.patoPrediction.update({
        where: { id: prediction.id },
        data: {
          status: prediction.status,
          started_at: prediction.started_at,
          completed_at: prediction.completed_at,
          output: imageWithoutBackground,
        },
      }),
    ]);

    console.log(`${patoPrediction.patoId} pato no-background image updated`);
  },
};

const predictionHandlers = [PatoWithoutBackgroundHandler];
