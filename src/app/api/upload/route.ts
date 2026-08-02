import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function generateFileName(originalName: string): string {
  const ext = originalName.split(".").pop() || "jpg";
  const safeName = originalName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${safeName}-${Date.now()}.${ext}`;
}

async function uploadToLocal(file: File, fileName: string): Promise<string> {
  const { writeFile, mkdir } = await import("fs/promises");
  const path = await import("path");

  const uploadDir = path.join(process.cwd(), "public", "images", "products");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `/images/products/${fileName}`;
}

async function uploadToS3(file: File, fileName: string): Promise<string> {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

  const client = new S3Client({
    region: process.env.AWS_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT, // e.g., https://<account>.r2.cloudflarestorage.com
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
  });

  const bucket = process.env.S3_BUCKET_NAME || "";
  const key = `products/${fileName}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read",
    })
  );

  const publicUrl = process.env.S3_PUBLIC_URL || `https://${bucket}.${process.env.S3_ENDPOINT?.replace("https://", "")}`;
  return `${publicUrl}/${key}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max size is 10MB." }, { status: 400 });
    }

    const fileName = generateFileName(file.name);

    // Use S3/R2 in production if configured, otherwise local filesystem
    const useS3 = process.env.S3_BUCKET_NAME && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY;
    const url = useS3
      ? await uploadToS3(file, fileName)
      : await uploadToLocal(file, fileName);

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[upload] error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}