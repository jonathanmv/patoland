import { File } from "@web-std/file";
import Jimp from "jimp";
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
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const prediction: unknown = req.body;
  if (!isValidReplicateGetPredictionResponse(prediction)) {
    console.error("Invalid prediction request", prediction);
    res.status(400).end();
    return;
  }

  console.log("Received prediction", prediction);
  await handlePrediction(prediction);
  console.log("Processed prediction", prediction);

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

  await Promise.allSettled(
    handlers.map(async (h) => {
      try {
        await h.handle(prediction);
      } catch (e) {
        console.error("Error handling prediction", prediction, e);
        throw e;
      }
    })
  );
}

/**
 * Updates the pato without background image url
 */
const PatoWithoutBackgroundHandler: PredictionHandler = {
  version: "e809cddc666ccfd38a044f795cf65baab62eedc4273d096bf05935b9a3059b59",
  async handle(prediction) {
    if (prediction.status !== "succeeded") {
      console.log("Prediction didn't succeed. Ignoring", prediction);
      return;
    }

    if (prediction.output === null) {
      console.error("Prediction output is null", prediction);
      throw new Error("Prediction output is null");
    }

    const patoPrediction = await prisma.patoPrediction.findUnique({
      where: { id: prediction.id },
    });

    if (!patoPrediction) {
      throw new Error("Pato prediction not found by id: " + prediction.id);
    }

    if (patoPrediction.status === "succeeded") {
      console.log("prediction already handled", prediction);
      return;
    }

    const imageWithoutBackgroundUrl = z
      .string()
      .parse(prediction.output || prediction.output[0]);

    console.log("Downloading and processing image", imageWithoutBackgroundUrl);
    const buffer = await downloadAndProcessImage(imageWithoutBackgroundUrl);
    console.log("Uploading processed image", imageWithoutBackgroundUrl);
    const url = await uploadImage(buffer);
    console.log("Processed image uploaded", imageWithoutBackgroundUrl, url);

    await prisma.$transaction([
      prisma.pato.update({
        where: { id: patoPrediction.patoId },
        data: {
          imageNoBgUrl: url,
        },
      }),
      prisma.patoPrediction.update({
        where: { id: prediction.id },
        data: {
          status: prediction.status,
          started_at: prediction.started_at,
          completed_at: prediction.completed_at,
          output: imageWithoutBackgroundUrl,
        },
      }),
    ]);

    console.log(`${patoPrediction.patoId} pato no-background image updated`);
  },
};

const predictionHandlers = [PatoWithoutBackgroundHandler];

async function downloadAndProcessImage(imageUrl: string) {
  const image = await Jimp.read(imageUrl);
  const croppedImage = image
    .autocrop({
      cropOnlyFrames: false,
      leaveBorder: 4,
      tolerance: 0.5,
    })
    .contrast(0.1);
  return await croppedImage.getBufferAsync(Jimp.MIME_PNG);
}

async function uploadImage(buffer: Buffer) {
  const result = (
    await utapi.uploadFiles([
      new File([buffer], "cropped-pato.png", {
        type: "image/png",
      }),
    ])
  )[0];

  if (!result || result.error !== null) {
    console.error("Error uploading image without background", {
      result,
    });
    throw new Error("Error uploading image without background");
  }

  return result.data.url;
}
