import type { NextApiRequest, NextApiResponse } from "next";
import { utapi } from "uploadthing/server";
import { z } from "zod";
import { prisma } from "~/server/db";
import {
  isValidReplicateGetPredictionResponse,
  type ReplicateGetPredictionResponse,
} from "~/server/replicate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prediction: unknown = req.body;
  if (!isValidReplicateGetPredictionResponse(prediction)) {
    console.error("Invalid prediction request", prediction);
    res.status(400).end();
    return;
  }

  await handlePrediction(prediction);

  res.status(200).end();
}

type PredictionHandler = {
  version: string;
  handle: (prediction: ReplicateGetPredictionResponse) => Promise<void>;
};

async function handlePrediction(prediction: ReplicateGetPredictionResponse) {
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

/**
 * Updates the pato without background image url
 */
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
