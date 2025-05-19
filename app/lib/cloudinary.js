import { v2 as cloudinary } from "cloudinary";

// Load environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteFromCloudinary(imageUrl) {
  try {
    // Skip if no image URL provided
    if (
      !imageUrl ||
      typeof imageUrl !== "string" ||
      !imageUrl.includes("/upload/")
    ) {
      console.warn(
        "⚠️ Skipping Cloudinary deletion: No valid image URL provided."
      );
      return { result: "skipped" };
    }

    const [_, rest] = imageUrl.split("/upload/");
    const parts = rest.split("/");
    const hasVersion = /^v\d+$/.test(parts[0]);
    const publicIdParts = hasVersion ? parts.slice(1) : parts;

    const lastPart = publicIdParts[publicIdParts.length - 1];
    publicIdParts[publicIdParts.length - 1] = lastPart.replace(/\.[^/.]+$/, "");

    const publicId = publicIdParts.join("/");

    console.log("🔍 Fixed public ID for deletion:", publicId);

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("❌ Cloudinary deletion failed:", error);
    return { result: "error", error };
  }
}
