import { z } from "zod";

export const createPredictionSchema = z.object({
  id: z.string(),
  version: z.string(),
  urls: z.object({
    get: z.string(),
    cancel: z.string(),
  }),
  created_at: z.string(),
  status: z.string(),
  input: z.any(),
  error: z.null().or(z.string()).optional(),
  logs: z.null().or(z.string()).optional(),
});

export type ReplicateCreatePredictionResponse = z.infer<
  typeof createPredictionSchema
>;

export const getPredictionRequestSchema = z.object({
  id: z.string(),
  version: z.string(),
  urls: z.object({
    get: z.string(),
    cancel: z.string(),
  }),
  created_at: z.string(),
  status: z.string(),
  input: z.any(),
  started_at: z.string(),
  completed_at: z.string(),
  error: z.null().or(z.string()).optional(),
  logs: z.null().or(z.string()).optional(),
  source: z.null().or(z.string()).optional(),
  output: z.string().or(z.array(z.string())),
  metrics: z.object({
    predict_time: z.number(),
  }),
});

export type ReplicateGetPredictionResponse = z.infer<
  typeof getPredictionRequestSchema
>;

export function isValidReplicateGetPredictionResponse(
  input: unknown
): input is ReplicateGetPredictionResponse {
  const result = getPredictionRequestSchema.safeParse(input);
  if (!result.success) {
    console.log(result.error.errors);
  }
  return result.success;
}

/**
 * Removes the background of the image using replicate.
 * Replicate will send a hook to /api/replicate-webhook
 * @see https://replicate.com/ilkerc/rembg/api
 * @see https://replicate.com/docs/reference/http#predictions.create--webhook_events_filter
 * @see https://github.com/replicate/scribble-diffusion/pull/27/commits/627c872c78aad89cadd02798d37d4696e3278a12
 */
export async function removeImageBackground(image_url: string) {
  const HOST = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const payload = {
    version: "e809cddc666ccfd38a044f795cf65baab62eedc4273d096bf05935b9a3059b59",
    input: { image_url },
    webhook: `${HOST}/api/replicate-webhook`,
    webhook_events_filter: ["completed"],
  };

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.REPLICATEAI_API_KEY || ""}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error("Error creating prediction", response);
  }

  return (await response.json()) as ReplicateCreatePredictionResponse;
}
