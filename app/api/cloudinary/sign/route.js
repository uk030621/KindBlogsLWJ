import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// ⛑️ Validate and configure Cloudinary
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error(
    "Missing Cloudinary environment variables. Please check .env.local"
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  const timestamp = Math.round(new Date().getTime() / 1000);

  // ✅ Use from env or fallback to a default
  const folder = process.env.CLOUDINARY_FOLDER || "blog-images";

  // ✅ Generate signature with folder info
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    process.env.CLOUDINARY_API_SECRET
  );

  // ✅ Return everything needed on client-side
  return NextResponse.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder,
  });
}
