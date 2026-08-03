import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-msvideo",
  "video/mpeg",
];

const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

function generateFileName(originalName: string): string {
  const ext = originalName.split(".").pop() || "bin";
  const safeName = originalName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${safeName}-${Date.now()}.${ext}`;
}

function isCloudinaryConfigured(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  return Boolean(cloudName && apiKey && apiSecret);
}

async function uploadToCloudinary(
  file: File,
  folder: string = "mechaura"
): Promise<{ url: string; publicId: string; resourceType: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  const isVideo = file.type.startsWith("video/");
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isVideo ? "video" : "image",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
        });
      }
    );
    uploadStream.end(buffer);
  });
}

async function uploadToLocal(file: File, fileName: string): Promise<string> {
  const { writeFile, mkdir } = await import("fs/promises");
  const path = await import("path");

  const uploadDir = path.join(process.cwd(), "public", "images", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `/images/uploads/${fileName}`;
}

async function uploadToS3(file: File, fileName: string): Promise<string> {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

  const client = new S3Client({
    region: process.env.AWS_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
  });

  const bucket = process.env.S3_BUCKET_NAME || "";
  const key = `uploads/${fileName}`;
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

  const publicUrl =
    process.env.S3_PUBLIC_URL ||
    `https://${bucket}.${process.env.S3_ENDPOINT?.replace("https://", "")}`;
  return `${publicUrl}/${key}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const requestedStorage = (formData.get("storage") as string) || "auto";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Supported formats: Images (JPEG, PNG, WebP, GIF, SVG) and Videos (MP4, WebM, OGG, MOV).",
        },
        { status: 400 }
      );
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image file too large. Max size is 15MB." },
        { status: 400 }
      );
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: "Video file too large. Max size is 100MB." },
        { status: 400 }
      );
    }

    const fileName = generateFileName(file.name);
    const hasCloudinary = isCloudinaryConfigured();

    let storageTarget = requestedStorage;
    if (storageTarget === "auto") {
      storageTarget = hasCloudinary ? "cloudinary" : "local";
    }

    if (storageTarget === "cloudinary") {
      if (!hasCloudinary) {
        return NextResponse.json(
          {
            error:
              "Cloudinary is selected but environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing. Please configure them or use Local System storage.",
          },
          { status: 400 }
        );
      }

      const res = await uploadToCloudinary(file);
      return NextResponse.json({
        url: res.url,
        provider: "cloudinary",
        mediaType: isVideo ? "video" : "image",
        publicId: res.publicId,
      });
    }

    if (storageTarget === "s3") {
      const url = await uploadToS3(file, fileName);
      return NextResponse.json({
        url,
        provider: "s3",
        mediaType: isVideo ? "video" : "image",
      });
    }

    // Default fallback: Local system storage
    const url = await uploadToLocal(file, fileName);
    return NextResponse.json({
      url,
      provider: "local",
      mediaType: isVideo ? "video" : "image",
    });
  } catch (err: any) {
    console.error("[upload] error:", err);
    return NextResponse.json(
      { error: err?.message || "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}