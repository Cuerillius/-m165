import { MongoClient, ObjectId } from "mongodb";

async function updateCollections() {
  const client = new MongoClient(
    "mongodb://admin:!12345678!@51.107.25.23:27017"
  );

  try {
    await client.connect();
    const db = client.db("event_management");

    // Update organisations collection
    await db
      .collection("organisations")
      .updateMany({}, { $set: { address: "Updated Address" } });
    console.log("Updated organisations collection");

    // Update events collection
    await db
      .collection("events")
      .updateMany({}, { $set: { description: "Updated Description" } });
    console.log("Updated events collection");

    // Update signUpParticipants collection
    await db
      .collection("signUpParticipants")
      .updateMany({}, { $set: { note: "Updated Note" } });
    console.log("Updated signUpParticipants collection");

    // Update eventManagers collection
    // Add a new event to the events array
    const newEventId = new ObjectId();
    await db
      .collection("eventManagers")
      .updateMany({}, { $push: { events: { $each: [newEventId] } } });
    console.log("Updated eventManagers collection");

    console.log("All collections updated");
  } catch (error) {
    console.error("Error updating collections:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

export { updateCollections };
updateCollections().catch(console.error);
