import { MongoClient, ObjectId } from "mongodb";

async function updateCollections() {
  const client = new MongoClient(
    "mongodb://admin:!12345678!@51.107.25.23:27017"
  );

  try {
    await client.connect();
    const db = client.db("event_management");

    // Sample ObjectIds
    const organisationIdToUpdate = new ObjectId();
    const eventIdToUpdate1 = new ObjectId();
    const eventIdToUpdate2 = new ObjectId();
    const signUpParticipantIdToReplace = new ObjectId();

    // 1. Update one organisation using updateOne with _id filter
    await db
      .collection("organisations")
      .updateOne(
        { _id: organisationIdToUpdate },
        { $set: { address: "Updated Address using updateOne" } }
      );
    console.log("Updated one organisation using updateOne");

    // 2. Update multiple events using updateMany with an OR conjunction
    await db
      .collection("events")
      .updateMany(
        { $or: [{ _id: eventIdToUpdate1 }, { _id: eventIdToUpdate2 }] },
        { $set: { description: "Updated Description using updateMany" } }
      );
    console.log("Updated multiple events using updateMany");

    // 3. Replace one signUpParticipant using replaceOne
    await db
      .collection("signUpParticipants")
      .replaceOne(
        { _id: signUpParticipantIdToReplace },
        { legalName: "Replaced Name", attending: true }
      );
    console.log("Replaced one signUpParticipant using replaceOne");
    // 4. Update multiple participants using updateMany with OR condition on fields other than _id

    console.log(
      "Updated multiple participants using updateMany with OR condition"
    );
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
