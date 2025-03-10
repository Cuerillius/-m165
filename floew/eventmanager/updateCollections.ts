import { MongoClient, ObjectId } from "mongodb";

async function updateCollections() {
  const client = new MongoClient(
    "mongodb://admin:!12345678!@51.107.25.23:27017"
  );

  try {
    await client.connect();
    const db = client.db("event_management");

    // Insert sample data (to demonstrate updateOne, updateMany, replaceOne)
    const org1Id = new ObjectId();
    const org2Id = new ObjectId();
    const org3Id = new ObjectId();
    await db.collection("organisations").insertMany([
      {
        _id: org1Id,
        name: "Org 1",
        address: "Address 1",
        contact: { name: "Contact 1", email: "contact1@example.com" },
      },
      {
        _id: org2Id,
        name: "Org 2",
        address: "Address 2",
        contact: { name: "Contact 2", email: "contact2@example.com" },
      },
      {
        _id: org3Id,
        name: "Org 3",
        address: "Address 3",
        contact: { name: "Contact 3", email: "contact3@example.com" },
      },
    ]);

    // Update one organisation
    await db
      .collection("organisations")
      .updateOne({ _id: org1Id }, { $set: { address: "Updated Address 1" } });
    console.log("Updated one organisation");

    // Update multiple organisations
    await db
      .collection("organisations")
      .updateMany(
        { $or: [{ name: "Org 2" }, { name: "Org 3" }] },
        { $set: { address: "Updated Address Many" } }
      );
    console.log("Updated multiple organisations");

    // Replace one organisation
    await db.collection("organisations").replaceOne(
      { _id: org3Id },
      {
        _id: org3Id,
        name: "Replaced Org 3",
        address: "Replaced Address 3",
        contact: { name: "Contact 3", email: "contact3@example.com" },
      }
    );
    console.log("Replaced one organisation");

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
