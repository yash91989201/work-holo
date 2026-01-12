import * as Minio from "minio";
import { env } from "../../env";
import { ALL_BUCKETS } from "./constants";

let minioClient: Minio.Client | null = null;
let bucketsInitialized = false;

function parseEndpoint(endpoint: string): {
  host: string;
  port: number;
  useSSL: boolean;
} {
  const url = new URL(endpoint);
  const useSSL = url.protocol === "https:";
  const host = url.hostname;

  let port: number;
  if (url.port) {
    port = Number.parseInt(url.port, 10);
  } else if (useSSL) {
    port = 443;
  } else {
    port = 9000;
  }

  return { host, port, useSSL };
}

function createMinioClient(): Minio.Client {
  const { host, port, useSSL } = parseEndpoint(env.S3_ENDPOINT);

  return new Minio.Client({
    endPoint: host,
    port,
    useSSL,
    accessKey: env.S3_ACCESS_KEY,
    secretKey: env.S3_SECRET_KEY,
  });
}

async function ensureBucketExists(
  client: Minio.Client,
  bucketName: string
): Promise<void> {
  const exists = await client.bucketExists(bucketName);
  if (!exists) {
    await client.makeBucket(bucketName);

    const publicPolicy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };
    await client.setBucketPolicy(bucketName, JSON.stringify(publicPolicy));
  }
}

async function initializeBuckets(client: Minio.Client): Promise<void> {
  if (bucketsInitialized) return;

  await Promise.all(
    ALL_BUCKETS.map((bucket) => ensureBucketExists(client, bucket))
  );
  bucketsInitialized = true;
}

export async function getStorageClient(): Promise<Minio.Client> {
  if (!minioClient) {
    minioClient = createMinioClient();
  }

  await initializeBuckets(minioClient);
  return minioClient;
}

export async function ensureBucket(bucketName: string): Promise<void> {
  const client = await getStorageClient();
  await ensureBucketExists(client, bucketName);
}

export { minioClient };
