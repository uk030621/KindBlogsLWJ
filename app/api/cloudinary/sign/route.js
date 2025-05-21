import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// ✅ Ensure required env vars are defined
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER = "blog-images", // fallback default
} = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error("❌ Missing Cloudinary environment variables.");
}

// ✅ Configure Cloudinary SDK
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export async function GET() {
  // 🚫 Disable caching
  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store",
  };

  const now = Math.floor(Date.now() / 1000);
  const timestamp = now + 60;

  console.log("📡 Timestamp sent at:", timestamp); // ✅ RIGHT HERE

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: CLOUDINARY_FOLDER },
    CLOUDINARY_API_SECRET
  );

  return NextResponse.json(
    {
      timestamp,
      signature,
      apiKey: CLOUDINARY_API_KEY,
      cloudName: CLOUDINARY_CLOUD_NAME,
      folder: CLOUDINARY_FOLDER,
    },
    { headers }
  );
}
