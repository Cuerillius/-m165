import { MongoClient } from "mongodb";

async function queryCollections() {
  const client = new MongoClient(
    "mongodb://admin:!12345678!@51.107.25.23:27017"
  );

  try {
    await client.connect();
    const db = client.db("event_management");

    // 1. Retrieve data from organisations collection with regex and projection including _id
    const organisations = await db
      .collection("organisations")
      .find(
        { name: { $regex: "Org", $options: "i" } },
        { projection: { _id: 1, name: 1 } }
      )
      .toArray();
    console.log(
      "Organisations (regex and projection with _id):",
      organisations
    );

    // Retrieve data from events collection
    const events = await db.collection("events").find().toArray();
    console.log("Events:", events);

    // select by regex
    const eventsByTitle = await db
      .collection("events")
      .find({ title: { $regex: /Event/ } })
      .toArray();
    console.log("Events by title:", eventsByTitle);

    // 3. Retrieve data from signUpParticipants collection with AND conjunction
    const signUpParticipants = await db
      .collection("signUpParticipants")
      .find({ legalName: { $exists: true }, attending: true })
      .toArray();
    console.log("SignUpParticipants (AND conjunction):", signUpParticipants);

    // 4. Retrieve data from eventManagers collection with no filter
    const eventManagers = await db.collection("eventManagers").find().toArray();
    console.log("EventManagers (no filter):", eventManagers);

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
