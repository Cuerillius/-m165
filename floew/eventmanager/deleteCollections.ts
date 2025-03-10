import { MongoClient, ObjectId } from "mongodb";

async function deleteCollections() {
  const client = new MongoClient(
    "mongodb://admin:!12345678!@51.107.25.23:27017"
  );

  try {
    await client.connect();
    const db = client.db("event_management");

    // Drop all collections
    try {
      await db.collection("organisations").drop();
      console.log("Dropped organisations collection");
    } catch (e) {
      console.log("organisations collection does not exist");
    }
    try {
      await db.collection("events").drop();
      console.log("Dropped events collection");
    } catch (e) {
      console.log("events collection does not exist");
    }
    try {
      await db.collection("signUpParticipants").drop();
      console.log("Dropped signUpParticipants collection");
    } catch (e) {
      console.log("signUpParticipants collection does not exist");
    }
    try {
      await db.collection("eventManagers").drop();
      console.log("Dropped eventManagers collection");
    } catch (e) {
      console.log("eventManagers collection does not exist");
    }
    console.log("All collections dropped");

    // Insert sample data (to demonstrate deleteOne and deleteMany)
    const org1Id = new ObjectId();
    const org2Id = new ObjectId();
    const org3Id = new ObjectId();
    await db.collection("organisations").insertMany([
      { _id: org1Id, name: "Org 1" },
      { _id: org2Id, name: "Org 2" },
      { _id: org3Id, name: "Org 3" },
    ]);

    // Delete one organisation
    await db.collection("organisations").deleteOne({ _id: org1Id });
    console.log("Deleted one organisation");

    // Delete multiple organisations
    await db.collection("organisations").deleteMany({
      $or: [{ _id: org2Id }, { _id: org3Id }],
    });
    console.log("Deleted multiple organisations");
  } catch (error) {
    console.error("Error deleting collections:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

export { deleteCollections };
deleteCollections().catch(console.error);
