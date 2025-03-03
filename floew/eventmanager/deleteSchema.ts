import { MongoClient } from "mongodb";

async function deleteCollections() {
  const client = new MongoClient(
    "mongodb://admin:!12345678!@51.107.25.23:27017"
  );

  try {
    await client.connect();
    const db = client.db("event_management");

    // Delete collections
    await db.collection("organisations").drop();
    console.log("Deleted organisations collection");

    await db.collection("events").drop();
    console.log("Deleted events collection");

    await db.collection("signUpParticipants").drop();
    console.log("Deleted signUpParticipants collection");

    await db.collection("eventManagers").drop();
    console.log("Deleted eventManagers collection");

    console.log("All collections deleted");
  } catch (error) {
    console.error("Error deleting collections:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

export { deleteCollections };
deleteCollections().catch(console.error);
