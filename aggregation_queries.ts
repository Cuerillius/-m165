import { MongoClient, ObjectId } from "mongodb";

export async function aggregate_queries() {
  const client = new MongoClient(
    "mongodb+srv://admin:kvrMf6XYPwOKJ3gy@cluster0.z4iqq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );

  try {
    await client.connect();
    const db = client.db("event_management");

    // Get the category ObjectId
    const concertCategory = await db
      .collection("categories")
      .findOne({ name: "Concert" });

    // 1. $match to replicate find() with AND
    const aggregation1 = await db
      .collection("events")
      .aggregate([
        {
          $match: {
            category: concertCategory?._id,
            location: "Zurich",
          },
        },
      ])
      .toArray();
    console.log("Aggregation 1:", aggregation1);

    // 2. $match, $project, $sort
    const aggregation2 = await db
      .collection("events")
      .aggregate([
        { $match: { price: { $gt: 50 } } },
        { $project: { title: 1, price: 1, _id: 0 } },
        { $sort: { price: -1 } },
      ])
      .toArray();
    console.log("Aggregation 2:", aggregation2);

    // 3. $sum
    const aggregation3 = await db
      .collection("events")
      .aggregate([{ $group: { _id: null, totalEvents: { $sum: 1 } } }])
      .toArray();
    console.log("Aggregation 3:", aggregation3);

    // 4. $group
    const aggregation4 = await db
      .collection("events")
      .aggregate([
        { $group: { _id: "$category", totalRevenue: { $sum: "$price" } } },
      ])
      .toArray();
    console.log("Aggregation 4:", aggregation4);

    // 5. $lookup (basic join)
    const aggregation5 = await db
      .collection("events")
      .aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
      ])
      .toArray();
    console.log("Aggregation 5:", aggregation5);

    // 6. $lookup with filtering and aggregation
    const aggregation6 = await db
      .collection("events")
      .aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        {
          $unwind: "$categoryInfo",
        },
        {
          $group: {
            _id: "$categoryInfo.name",
            totalEvents: { $sum: 1 },
          },
        },
      ])
      .toArray();
    console.log("Aggregation 6:", aggregation6);

    // 7. Simple query that outputs subdocuments
    const aggregation7 = await db
      .collection("events")
      .aggregate([{ $project: { _id: 0, location: 1 } }])
      .toArray();
    console.log("Aggregation 7:", aggregation7);

    // 8. Query that filters based on fields of subdocuments
    const aggregation8 = await db
      .collection("events")
      .aggregate([
        {
          $match: {
            "categoryInfo.name": "Concert",
          },
        },
      ])
      .toArray();
    console.log("Aggregation 8:", aggregation8);

    // 9. Using $unwind to flatten the return
    const aggregation9 = await db
      .collection("events")
      .aggregate([
        { $unwind: { path: "$tags", preserveNullAndEmptyArrays: true } },
      ])
      .toArray();
    console.log("Aggregation 9:", aggregation9);
  } finally {
    await client.close();
  }
}

aggregate_queries().catch(console.error);
