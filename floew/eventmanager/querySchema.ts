import { MongoClient } from "mongodb";

async function queryCollections() {
  const client = new MongoClient(
    "mongodb://admin:!12345678!@51.107.25.23:27017"
  );

  try {
    await client.connect();
    const db = client.db("event_management");

    // Retrieve data from organisations collection
    const organisations = await db.collection("organisations").find().toArray();
    console.log("Organisations:", organisations);

    // Retrieve data from events collection
    const events = await db.collection("events").find().toArray();
    console.log("Events:", events);

    // Retrieve data from signUpParticipants collection
    const signUpParticipants = await db
      .collection("signUpParticipants")
      .find()
      .toArray();
    console.log("SignUpParticipants:", signUpParticipants);

    // Retrieve data from eventManagers collection
    const eventManagers = await db.collection("eventManagers").find().toArray();
    console.log("EventManagers:", eventManagers);

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
