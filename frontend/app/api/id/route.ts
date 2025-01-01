// import { NextApiRequest, NextApiResponse } from "next";
// // /app/api/id/route.ts
// import { MongoClient } from "mongodb";

// // MongoDB URI
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"; // Make sure to use your own MongoDB URI
// const client = new MongoClient(MONGODB_URI);

// // Function to connect to MongoDB
// async function connectToDatabase() {
//   await client.connect();
//   return client.db("articles"); // Your database name
// }

// // POST handler
// export async function POST(req: Request) {
//   try {
//     const { articleId, index } = await req.json(); // Parse the request body

//     // Validation
//     if (!articleId || index === undefined) {
//       return new Response("Missing required fields", { status: 400 });
//     }

//     // Connect to MongoDB
//     const db = await connectToDatabase();
//     const collection = db.collection("articles"); // Collection name for storing votes

//     // Insert the vote into MongoDB
//     const result = await collection.insertOne({
//       articleId,
//       index,
//       timestamp: new Date(),
//     });

//     // Respond with success
//     return new Response(JSON.stringify({ message: "Vote saved successfully", result }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Error processing vote:", error);
//     return new Response("Failed to save vote", { status: 500 });
//   }
// }
