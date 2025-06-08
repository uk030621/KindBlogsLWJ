import { MongoClient, ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
    const submissions = db.collection("submissions");

    const { status } = await req.json();
    const id = params.id; // Extract ID from URL

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ message: "Invalid ID format" }), {
        status: 400,
      });
    }

    const result = await submissions.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    client.close();

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ message: "No matching submission found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ message: "Updated successfully" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error updating submission" }),
      { status: 500 }
    );
  }
}
