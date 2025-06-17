import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/mongodb";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const { fullname, email, message } = await req.json();

  const errors = [];
  if (!fullname) errors.push("Full name is required.");
  if (!email || !email.includes("@")) errors.push("Valid email is required.");
  if (!message) errors.push("Message cannot be empty.");

  if (errors.length > 0) {
    return NextResponse.json({ msg: errors, success: false });
  }

  try {
    const client = await connectToDB();
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("contacts");

    await collection.insertOne({
      fullname,
      email,
      message,
      date: new Date(),
    });

    // ✅ Send email notification
    await resend.emails.send({
      from: `Contact Form <${process.env.CONTACT_FROM_EMAIL}>`, // must be verified in Resend
      to: process.env.ADMIN_EMAILS, // replace with your real email address
      subject: "📩 New Contact Form Message",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${fullname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr />
        <small>This message was sent via your contact form.</small>
      `,
    });

    return NextResponse.json({
      msg: ["Message sent successfully."],
      success: true,
    });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({
      msg: ["Something went wrong."],
      success: false,
    });
  }
}

export async function GET() {
  try {
    const client = await connectToDB();
    const db = client.db(process.env.MONGODB_DB);
    const messages = await db
      .collection("contacts")
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      msg: ["Unable to fetch messages."],
      success: false,
    });
  }
}
