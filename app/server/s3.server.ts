import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3,
} from "@aws-sdk/client-s3";
import { unstable_composeUploadHandlers } from "@remix-run/node";
import { ulid } from "ulid";

const { S3_BUCKET, AWS_REGION, ACCESS_KEY_ID, SECRET_ACCESS_KEY } = process.env;

const s3Client = new S3({
  region: AWS_REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID || "",
    secretAccessKey: SECRET_ACCESS_KEY || "",
  },
});

const uploadStreamToS3 = async (
  data: AsyncIterable<Uint8Array>,
  key: string,
  contentType: string
) => {
  console.log(key);
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
    if (formField.name === "video") {
      const filename = `videos/${ulid()}/${formField.filename}`;
      return await uploadStreamToS3(
        formField.data,
        filename,
        formField.contentType
      ); // Returns the key
    }
    // We are uploading the attachment and returning the key for storage and retrieval. Everything else needs to be serialized using TextDecoder.
    return new TextDecoder().decode(await convertToBuffer(formField.data));
  }
);
