import { MongoClient, ObjectId } from "mongodb";

export async function importAggregationData() {
  const client = new MongoClient(
    "mongodb+srv://admin:kvrMf6XYPwOKJ3gy@cluster0.z4iqq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );

  try {
    await client.connect();
    const db = client.db("event_management");

    // Clear existing data
    await db.collection("organisations").deleteMany({});
    await db.collection("events").deleteMany({});
    await db.collection("signUpParticipants").deleteMany({});
    console.log("Cleared existing data");

    // Sample data for organisations
    const organisations = [
      {
        name: "Organisation A",
        contact: { name: "Contact A", email: "a@example.com" },
      },
      {
        name: "Organisation B",
        contact: { name: "Contact B", email: "a@example.com" },
      },
    ];

    // Sample data for signUpParticipants
    const categories = [
      { _id: new ObjectId(), name: "Concert" },
      { _id: new ObjectId(), name: "Workshop" },
    ];

    // Insert data into categories collection
    const categoryResult = await db
      .collection("categories")
      .insertMany(categories);
    console.log("Inserted categories");

    const concertCategoryId = categoryResult.insertedIds[0];
    const workshopCategoryId = categoryResult.insertedIds[1];

    // Sample data for events
    // Sample data for events
    const events = [
      {
        date: new Date(),
        title: "Concert 1",
        description: "Description 1",
        category: new ObjectId("67cea23b418cf5262d5f19fe"),
        location: "Zurich",
        price: 60,
        tags: ["popular", "featured"],
      },
      {
        date: new Date(),
        title: "Concert 2",
        description: "Description 2",
        category: new ObjectId("67cea23b418cf5262d5f19fe"),
        location: "Geneva",
        price: 40,
        tags: ["new"],
      },
      {
        date: new Date(),
        title: "Workshop 1",
        description: "Description 3",
        category: new ObjectId("67cea23b418cf5262d5f19ff"),
        location: "Zurich",
        price: 80,
        tags: ["trending"],
      },
      {
        date: new Date(),
        title: "Workshop 2",
        description: "Description 4",
        category: new ObjectId("67cea23b418cf5262d5f19ff"),
        location: "Bern",
        price: 100,
        tags: ["expensive"],
      },
    ];

    await db.collection("events").insertMany(events);
    console.log("Inserted events");

    console.log("All data imported");
  } finally {
    await client.close();
  }
}
