import { MongoClient, ObjectId } from "mongodb";

async function fillCollections() {
  const client = new MongoClient(
    "mongodb://admin:!12345678!@51.107.25.23:27017"
  );

  try {
    await client.connect();
    const db = client.db("event_management");

    // Declare ObjectIds
    const organisationId1 = new ObjectId();
    const organisationId2 = new ObjectId();
    const eventId1 = new ObjectId();
    const eventId2 = new ObjectId();
    const signUpParticipantId1 = new ObjectId();
    const signUpParticipantId2 = new ObjectId();
    const eventManagerId1 = new ObjectId();
    const eventManagerId2 = new ObjectId();

    // Sample data for organisations
    const org1Id = new ObjectId();
    const org2Id = new ObjectId();
    const organisations = [
      {
        _id: org1Id,
        name: "Organisation 1",
        address: "Address 1",
        contact: {
          name: "Contact 1",
          email: "contact1@example.com",
          phone: "123-456-7890",
        },
      },
      {
        _id: org2Id,
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
    const event1Id = new ObjectId();
    const event2Id = new ObjectId();
    const events = [
      {
        _id: event1Id,
        date: new Date(),
        title: "Event 1",
        description: "Description 1",
        signups: [],
      },
      {
        _id: event2Id,
        date: new Date(),
        title: "Event 2",
        description: "Description 2",
        signups: [],
      },
    ];

    // Sample data for signUpParticipants
    const participant1Id = new ObjectId();
    const participant2Id = new ObjectId();
    const signUpParticipants = [
      {
        _id: participant1Id,
        legalName: "Participant 1",
        nickName: "Nick 1",
        note: "Note 1",
        attending: true,
      },
      {
        _id: participant2Id,
        legalName: "Participant 2",
        nickName: "Nick 2",
        note: "Note 2",
        attending: false,
      },
    ];

    // Sample data for eventManagers
    const eventManager1Id = new ObjectId();
    const eventManager2Id = new ObjectId();
    const eventManagers = [
      {
        _id: eventManager1Id,
        organisation: org1Id,
        events: [event1Id, event2Id],
      },
      {
        _id: eventManager2Id,
        organisation: org2Id,
        events: [event1Id],
      },
    ];

    // Insert data into collections
    await db.collection("organisations").insertMany(organisations);
    console.log("Inserted organisations data");

    await db.collection("events").insertMany(events);
    console.log("Inserted events data");

    await db.collection("signUpParticipants").insertOne(signUpParticipants[0]);
    console.log("Inserted signUpParticipants data");

    // Get the _id of the inserted events
    const eventIds = Object.values(eventsResult.insertedIds);

    // Sample data for eventManagers
    const eventManagers = {
      _id: eventManagerId1,
      organisation: new ObjectId(), // Replace with actual ObjectId
      events: eventIds,
    };

    await db.collection("eventManagers").insertOne(eventManagers);
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
