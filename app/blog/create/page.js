"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CreateBlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  useEffect(() => {
    if (sendEmail) {
      fetch("/api/alloweduserlist", {
        method: "GET",
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((data) => setAllowedUsers(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Error fetching users", err));
    }
  }, [sendEmail]);

  if (status === "loading") return <p className="p-4">Loading...</p>;
  if (!session) {
    router.push("/");
    return null;
  }

  const uploadImageWithRetry = async (maxRetries = 3) => {
    let attempts = 0;
    let imageUrl = "";

    while (attempts < maxRetries) {
      try {
        setImageLoading(true);
        const signRes = await fetch("/api/cloudinary/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder: "blog-images" }),
        });

        const { signature, timestamp, apiKey, cloudName, folder } =
          await signRes.json();

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", folder);

        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          { method: "POST", body: formData }
        );

        const debugText = await cloudinaryRes.text();
        if (!cloudinaryRes.ok) {
          throw new Error(`Cloudinary upload failed: ${debugText}`);
        }

        const cloudinaryData = JSON.parse(debugText);
        imageUrl = cloudinaryData.secure_url;
        break;
      } catch (err) {
        console.error(`Upload attempt ${attempts + 1} failed:`, err);
        attempts++;
        await new Promise((res) => setTimeout(res, 1000));
      }
    }

    setImageLoading(false);

    if (!imageUrl) {
      alert("Image upload failed after multiple attempts.");
      throw new Error("Failed to upload image.");
    }

    return imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = "";

    if (imageFile) {
      try {
        imageUrl = await uploadImageWithRetry();
      } catch (err) {
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          author: session.user.name,
          email: session.user.email,
          imageUrl,
          createdAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        if (sendEmail && selectedRecipients.length > 0) {
          await fetch("/api/email/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              content,
              imageUrl,
              recipients: selectedRecipients,
            }),
          });
        }

        //router.refresh();
        //router.replace("/blog");

        setTimeout(() => {
          window.dispatchEvent(new Event("post:created"));
          router.refresh(); // refresh first
          router.replace("/blog"); // then navigate
        }, 200);
      } else {
        alert("Failed to create blog");
      }
    } catch (err) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-2 mt-4">
      <div className="flex gap-4 items-center">
        <h1 className="text-2xl font-bold mb-4 text-slate-700 ml-4">
          Submit a post...
        </h1>
        <Image
          src="/post.jpg"
          alt="Tips & Tales - Share your wisdom and stories"
          width={75}
          height={75}
          unoptimized
          className="rounded-full mb-4"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Post Title"
          className="w-full px-4 py-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Post Content"
          className="w-full px-4 py-2 border rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="block"
        />

        {imageLoading && (
          <p className="text-sm text-gray-500 bg-green-200 w-fit px-2 py-2">
            Uploading image...
          </p>
        )}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={sendEmail}
            onChange={() => setSendEmail(!sendEmail)}
            className="h-4 w-4"
          />
          <span>Send this post to selected allowed users</span>
        </label>

        {sendEmail && allowedUsers.length > 0 && (
          <div className="w-full border p-2 rounded">
            <button
              type="button"
              onClick={() => {
                const all = allowedUsers.map((u) => u.email);
                setSelectedRecipients(
                  selectedRecipients.length === all.length ? [] : all
                );
              }}
              className="mb-2 px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
            >
              {selectedRecipients.length === allowedUsers.length
                ? "Deselect All"
                : "Select All"}
            </button>

            {allowedUsers.map(({ name, email }) => {
              const isSelected = selectedRecipients.includes(email);
              return (
                <label key={email} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={email}
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRecipients([...selectedRecipients, email]);
                      } else {
                        setSelectedRecipients(
                          selectedRecipients.filter((r) => r !== email)
                        );
                      }
                    }}
                    className="h-4 w-4"
                  />
                  <span>{name}</span>
                </label>
              );
            })}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Posting..." : "Submit Post"}
        </button>
      </form>
    </div>
  );
}
