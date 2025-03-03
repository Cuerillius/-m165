const { MongoClient } = require("mongodb");

async function createCollections() {
  const client = new MongoClient("mongodb://admin:1223334444@54.82.121.234:27017/?authSource=admin&readPreference=primary&ssl=false");
  try {
    await client.connect();
    const db = client.db("scout_management");
    console.log("Connected to MongoDB");

    // List of collections to drop and recreate
    const collections = [
      "troops",
      "scouts",
    ];

    // Drop existing collections
    for (const collection of collections) {
      try {
        await db.dropCollection(collection);
        console.log(`Dropped existing ${collection} collection`);
      } catch (error) {
        if (error.codeName === "NamespaceNotFound") {
          console.log(
            `${collection} collection did not exist, proceeding to create it`
          );
        } else {
          throw error; // Re-throw unexpected errors
        }
      }
    }

    // 1. Create Scouts collection
    await db.createCollection("scouts", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["firstname", "lastname", "badges"],
          properties: {
            firstname: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            lastname: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            nickname: {
              bsonType: "string",
              description: "must be a string if present",
            },
            badges: {
              bsonType: "array",
              items: {
                bsonType: "string",
                description: "must be an array of strings (Badge names)",
              },
              description: "must be an array of strings and is required",
            },
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });
    console.log("Created scouts collection");

    // 2. Create Troops collection
    await db.createCollection("troops", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["Name", "Motto", "Groups", "availableCourse"],
          properties: {
            Name: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            Motto: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            Groups: {
              bsonType: "array",
              items: {
                bsonType: "object",
                required: ["Name", "Year", "GroupLeader", "scouts"],
                properties: {
                  Name: { bsonType: "string", description: "Group Name must be a string and is required" },
                  Year: { bsonType: "number", description: "Group Year must be a number and is required" },
                  GroupLeader: {
                    bsonType: "objectId",
                    description: "GroupLeader must be an ObjectId (ScoutId) and is required, referencing scouts collection",
                  },
                  scouts: {
                    bsonType: "array",
                    items: {
                      bsonType: "objectId",
                      description: "scouts must be an array of ObjectIds (ScoutIds), referencing scouts collection",
                    },
                    description: "scouts must be an array of ObjectIds and is required",
                  },
                },
              },
              description: "Groups must be an array of group objects and is required",
            },
            availableCourse: {
              bsonType: "array",
              items: {
                bsonType: "object",
                required: ["Name", "Badge", "Participants"],
                properties: {
                  Name: { bsonType: "string", description: "Course Name must be a string and is required" },
                  Badge: { bsonType: "string", description: "Course Badge must be a string and is required" },
                  Participants: {
                    bsonType: "array",
                    items: {
                      bsonType: "objectId",
                      description: "Participants must be an array of ObjectIds (scoutid), referencing scouts collection",
                    },
                    description: "Participants must be an array of ObjectIds and is required",
                  },
                },
              },
              description: "availableCourse must be an array of course objects and is required",
            },
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });
    console.log("Created troops collection");


    console.log("All collections created with validation schemas");
  } catch (error) {
    console.error("Error creating collections:", error);
  } finally {
    // Close the connection
    await client.close();
    console.log("MongoDB connection closed");
  }
}

// Execute the function
createCollections();