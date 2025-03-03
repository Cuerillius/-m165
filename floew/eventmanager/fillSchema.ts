import { MongoClient, ObjectId } from "mongodb";

async function fillCollections() {
  const client = new MongoClient(
    "mongodb://admin:!12345678!@51.107.25.23:27017"
  );

  try {
    await client.connect();
    const db = client.db("event_management");

    // Sample data for organisations
    const organisations = [
      {
        name: "Organisation 1",
        address: "Address 1",
        contact: {
          name: "Contact 1",
          email: "contact1@example.com",
          phone: "123-456-7890",
        },
      },
      {
        name: "Organisation 2",
        address: "Address 2",
        contact: {
          name: "Contact 2",
          email: "contact2@example.com",
          phone: "987-654-3210",
        },
      },
    ];

    // Sample data for events
    const events = [
      {
        date: new Date(),
        title: "Event 1",
        description: "Description 1",
        signups: [],
      },
      {
        date: new Date(),
        title: "Event 2",
        description: "Description 2",
        signups: [],
      },
    ];

    // Sample data for signUpParticipants
    const signUpParticipants = [
      {
        legalName: "Participant 1",
        nickName: "Nick 1",
        note: "Note 1",
        attending: true,
      },
      {
        legalName: "Participant 2",
        nickName: "Nick 2",
        note: "Note 2",
        attending: false,
      },
    ];

    // Insert data into collections
    await db.collection("organisations").insertMany(organisations);
    console.log("Inserted organisations data");

    const eventsResult = await db.collection("events").insertMany(events);
    console.log("Inserted events data");

    const signUpParticipantsResult = await db
      .collection("signUpParticipants")
      .insertMany(signUpParticipants);
    console.log("Inserted signUpParticipants data");

    // Get the _id of the inserted events
    const eventIds = Object.values(eventsResult.insertedIds);

    // Sample data for eventManagers
    const eventManagers = [
      {
        organisation: new ObjectId(), // Replace with actual ObjectId
        events: eventIds,
      },
      {
        organisation: new ObjectId(), // Replace with actual ObjectId
        events: eventIds,
      },
    ];

    await db.collection("eventManagers").insertMany(eventManagers);
    console.log("Inserted eventManagers data");

    console.log("All collections filled with sample data");
  } catch (error) {
    console.error("Error filling collections:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

export { fillCollections };
fillCollections().catch(console.error);
