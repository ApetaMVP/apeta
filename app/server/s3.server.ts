import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3,
  S3Client,
} from "@aws-sdk/client-s3";
import { Hash } from "@aws-sdk/hash-node";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { parseUrl } from "@aws-sdk/url-parser";
import { formatUrl } from "@aws-sdk/util-format-url";
import { unstable_composeUploadHandlers } from "@remix-run/node";
import short from "short-uuid";

const { S3_BUCKET, AWS_REGION, ACCESS_KEY_ID, SECRET_ACCESS_KEY } = process.env;

const s3Client = new S3({
  region: AWS_REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID || "",
    secretAccessKey: SECRET_ACCESS_KEY || "",
  },
});

const s3Clientv2 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID || "",
    secretAccessKey: SECRET_ACCESS_KEY || "",
  },
});

const uploadStreamToS3 = async (
  data: AsyncIterable<Uint8Array>,
  key: string,
  contentType: string,
) => {
  const params: PutObjectCommandInput = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: await convertToBuffer(data),
    ContentType: contentType,
  };
  await s3Client.send(new PutObjectCommand(params));
  return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
};

async function convertToBuffer(arr: AsyncIterable<Uint8Array>) {
  const result = [];
  for await (const chunk of arr) {
    result.push(chunk);
  }
  return Buffer.concat(result);
}

export const uploadHandler = unstable_composeUploadHandlers(
  async (formField) => {
    if (formField.name === "video" || formField.name === "image") {
      const filename = `${formField.name}s/${short.generate()}/${
        formField.filename
      }`;
      return await uploadStreamToS3(
        formField.data,
        filename,
        formField.contentType,
      ); // Returns the key
    }
    // We are uploading the attachment and returning the key for storage and retrieval. Everything else needs to be serialized using TextDecoder.
    return new TextDecoder().decode(await convertToBuffer(formField.data));
  },
);

export const createPresignedUrl = async (filename: string, type = "video") => {
  const path = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${type}s/${short.generate()}/${filename}`;
  const url = parseUrl(path);
  const presigner = new S3RequestPresigner({
    credentials: {
      accessKeyId: ACCESS_KEY_ID || "",
      secretAccessKey: SECRET_ACCESS_KEY || "",
    },
    region: AWS_REGION || "us-east-1",
    sha256: Hash.bind(null, "sha256"),
  });
  const signedUrlObject = await presigner.presign(
    new HttpRequest({ ...url, method: "PUT" }),
  );
  return { uploadUrl: formatUrl(signedUrlObject), path };
};
