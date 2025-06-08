import { MongoClient } from "mongodb";

const SUBMISSION_LIMIT = 1000;
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const requestCounts = new Map();

export async function POST(req) {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
    const submissions = db.collection("submissions");

    // Check total submission count
    const count = await submissions.countDocuments();
    if (count >= SUBMISSION_LIMIT) {
      client.close();
      return new Response(
        JSON.stringify({
          message: "Apologies. Submission limit reached. Try again later.",
        }),
        { status: 429 }
      );
    }

    // Rate limiting per IP
    const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 1, timestamp: Date.now() });
    } else {
      const entry = requestCounts.get(ip);
      entry.count += 1;

      if (Date.now() - entry.timestamp > RATE_LIMIT_WINDOW) {
        entry.count = 1;
        entry.timestamp = Date.now();
      }

      if (entry.count > 5) {
        client.close();
        return new Response(
          JSON.stringify({ message: "Too many requests, slow down!" }),
          { status: 429 }
        );
      }
    }

    const { name, email, justification } = await req.json();
    await submissions.insertOne({
      name,
      email,
      justification,
      status: "pending",
    });

    client.close();
    return new Response(JSON.stringify({ message: "Submission successful" }), {
      status: 201,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error submitting request" }),
      { status: 500 }
    );
  }
}

export async function GET() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const submissions = db.collection("submissions");
  const result = await submissions.find().toArray();
  client.close();
  return new Response(JSON.stringify(result), { status: 200 });
}
