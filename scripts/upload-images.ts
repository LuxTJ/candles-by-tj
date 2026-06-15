import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

// Get these from: npx wrangler r2 bucket list, then create API token
const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const imageDir = "C:/Users/Tjuan/Downloads/Product Photos/Product Photos";
const bucket = "candles-by-tj-images";

const imageMap: Record<string, string> = {
  "01..png": "01.png",
  "02..png": "02.png",
  "03..png": "03.png",
  "04..png": "04.png",
  "05..png": "05.png",
  "06..png": "06.png",
  "07..png": "07.png",
  "08..png": "08.png",
  "09..png": "09.png",
  "10..png": "10.png",
  "11..jpg": "11.jpg",
  "12..png": "12.png",
  "13..png": "13.png",
  "14..jpg": "14.jpg",
  "15..png": "15.png",
  "16..png": "16.png",
  "17..png": "17.png",
  "18..png": "18.png",
};

async function upload() {
  for (const [filename, key] of Object.entries(imageMap)) {
    const filepath = path.join(imageDir, filename);
    const body = fs.readFileSync(filepath);
    const contentType = filename.endsWith(".jpg") ? "image/jpeg" : "image/png";

    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }));

    console.log(`✓ Uploaded ${key}`);
  }
  console.log("All images uploaded to R2.");
}

upload().catch(console.error);
