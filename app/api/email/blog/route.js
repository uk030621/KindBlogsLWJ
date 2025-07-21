//app/api/email/blog/route.js
import { NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/sendEmail";

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, content, imageUrl, recipients, senderName, senderEmail } =
      body;

    // Ensure recipients is an array of valid strings
    const emails = (recipients || []).filter(Boolean);

    if (emails.length === 0) {
      return NextResponse.json({ message: "No recipients found." });
    }

    const baseUrl = process.env.BASE_URL || "http://localhost:3000"; // fallback for local dev

    const subject = `📰 New Blog Post: ${title}`;
    const postUrl = `${baseUrl}/`;

    const html = `
  <div style="font-family: sans-serif; line-height: 1.5;">
    <!-- <h2>${title}</h2> -->
    <p><strong>From:</strong> ${senderName}</p>
    <p><strong></strong> ${senderEmail}</p>
    <p>${content}</p>
    ${
      imageUrl
        ? `<img src="${imageUrl}" alt="${title}" style="max-width: 600px; width: 100%; height: auto;" />`
        : ""
    }
    <p>Link to <a href="${postUrl}">Tips & Tales application</a> for access to all blog posts</p>

  </div>
`;
    await sendEmail({
      to: emails,
      subject,
      html,
    });

    return NextResponse.json({ message: "Emails sent" });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
