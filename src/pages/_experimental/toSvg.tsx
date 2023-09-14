/* eslint-disable @next/next/no-img-element */
import { bitmap2vector } from "bitmap2vector";
import Jimp from "jimp";
import { type InferGetServerSidePropsType } from "next";
import NextImage from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { getHostUrl } from "~/utils/getHostUrl";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Home({ image }: Props) {
  const svgRef = useRef<HTMLDivElement>(null);

  const drawSvg = useCallback(async () => {
    const r = await bitmap2vector({
      input: image,
      qtres: 100,
    });

    if (!svgRef.current) return;
    svgRef.current.innerHTML = r.content;
  }, [image]);

  useEffect(() => {
    void drawSvg();
  }, [drawSvg]);

  return (
    <div className="mx-auto max-w-5xl text-center">
      <div className="my-4 flex flex-col items-center justify-center gap-12 lg:flex-row">
        <div className="my-2 flex flex-col items-center gap-4 rounded-xl border-4 border-b-8 border-yellow-500 bg-yellow-300 p-6">
          <h2 className="text-2xl font-bold">Original</h2>
          <NextImage
            priority={true}
            className="rounded-xl border-4 border-yellow-500"
            src={"/pato.jpeg"}
            width={237}
            height={360}
            alt={""}
          />
        </div>
        <div className="my-2 flex flex-col gap-4 rounded-xl border-4 border-b-8 border-yellow-500 bg-yellow-300 p-6">
          <h2 className="text-2xl font-bold">Black & White</h2>
          <NextImage
            priority={true}
            className="rounded-xl border-4 border-yellow-500"
            src={image}
            width={237}
            height={360}
            alt={""}
          />
        </div>
        <div className="my-2 flex flex-col gap-4 rounded-xl border-4 border-b-8 border-yellow-500 bg-yellow-300 p-6">
          <h2 className="text-2xl font-bold">SVG</h2>
          <div
            ref={svgRef}
            className="overflow-hidden rounded-xl border-4 border-yellow-500"
          ></div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      image: await processImage(),
    },
  };
}

async function processImage() {
  const host = getHostUrl();
  const image = await Jimp.read(host + "/pato.jpeg");

  const croppedImage = image
    .threshold({ max: 200, replace: 200, autoGreyscale: false })
    .contrast(0.8)
    .resize(237, 360);
  return await croppedImage.getBase64Async(Jimp.MIME_PNG);
}

// Left here for reference
// Also checkout https://github.com/davidsonfellipe/lena.js for image processing
export function imageStringToBlackAndWhite(image: string) {
  const img = new Image();
  img.src = image;
  if (img.width === 0 || img.height === 0) return image;

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  console.log(img.width, img.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) return image;

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, img.width, img.height);

  const blackAndWhite = imageData.data.map((pixel: number, index: number) => {
    if (index % 4 === 3) return pixel;
    return pixel > 128 ? 255 : 0;
  });

  imageData.data.set(blackAndWhite);
  return canvas.toDataURL();
}
