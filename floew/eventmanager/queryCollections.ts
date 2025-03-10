import { MongoClient } from "mongodb";

async function queryCollections() {
  const client = new MongoClient(
    "mongodb://admin:!12345678!@51.107.25.23:27017"
  );

  try {
    await client.connect();
    const db = client.db("event_management");

    // Query organisations
    const organisations = await db
      .collection("organisations")
      .find({ name: { $regex: "Org", $options: "i" } })
      .project({ _id: 1 })
      .toArray();
    console.log("Organisations (with _id):", organisations);

    // Query events
    const events = await db
      .collection("events")
      .find({ date: { $lt: new Date() } })
      .project({ _id: 0 })
      .toArray();
    console.log("Events (without _id):", events);

    // Query signUpParticipants
    const signUpParticipants = await db
      .collection("signUpParticipants")
      .find({ $or: [{ legalName: "Participant 1" }, { nickName: "Nick 2" }] })
      .toArray();
    console.log("SignUpParticipants (OR):", signUpParticipants);

    // Query eventManagers
    const eventManagers = await db
      .collection("eventManagers")
      .find({ organisation: { $exists: true }, events: { $exists: true } })
      .toArray();
    console.log("EventManagers (AND):", eventManagers);

    console.log("All collections queried");
  } catch (error) {
    console.error("Error querying collections:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

export { queryCollections };
queryCollections().catch(console.error);
