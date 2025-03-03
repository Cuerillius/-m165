const { MongoClient } = require("mongodb");

// Function to create collections with validation schemas
async function createCollections() {
  // Connect to MongoDB (assumes a local instance at default port)
  const client = new MongoClient("mongodb://admin:1223334444@54.82.121.234:27017/?authSource=admin&readPreference=primary&ssl=false"); // Replace 'link' with your MongoDB connection string
  try {
    await client.connect();
    const db = client.db("scout_management"); // Database name

    console.log("Connected to MongoDB");

    // List of collections to drop and recreate
    const collections = [
      "hierarchical_units", // Combined collection
      "scouts",        // Scouts collection remains separate
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

    // 1. Create Scouts collection (same as before)
    await db.createCollection("scouts", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["firstname", "lastname"],
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
                description: "must be a string",
              },
              description: "must be an array of strings",
            },
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });
    console.log("Created scouts collection");

    // 2. Create Hierarchical Units collection (troops, groups, courses combined)
    await db.createCollection("hierarchical_units", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["unitType", "name"], // Common required fields
          properties: {
            unitType: {
              bsonType: "string",
              enum: ["troop", "group", "course"], // Allowed unit types
              description: "must be a string and enum ['troop', 'group', 'course'] and is required",
            },
            name: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            motto: { // Troop-specific
              bsonType: "string",
              description: "must be a string if unitType is 'troop'",
            },
            groups: { // Troop-specific, array of embedded group documents
              bsonType: "array",
              items: {
                bsonType: "object",
                required: ["name", "year", "groupLeader"], // Required fields for embedded group
                properties: {
                  name: { bsonType: "string" },
                  year: { bsonType: "int" },
                  groupLeader: { // Embedded Scout for groupLeader
                    bsonType: "object",
                    required: ["firstname", "lastname"],
                    properties: {
                      firstname: { bsonType: "string" },
                      lastname: { bsonType: "string" },
                      nickname: { bsonType: "string" },
                      badges: { bsonType: "array", items: { bsonType: "string" } },
                    },
                  },
                  scouts: { // Embedded Scouts for group members
                    bsonType: "array",
                    items: {
                      bsonType: "object",
                      required: ["firstname", "lastname"],
                      properties: {
                        firstname: { bsonType: "string" },
                        lastname: { bsonType: "string" },
                        nickname: { bsonType: "string" },
                        badges: { bsonType: "array", items: { bsonType: "string" } },
                      },
                    },
                  },
                },
              },
              description: "must be an array of embedded group objects if unitType is 'troop'",
            },
            availableCourses: { // Troop-specific, array of ObjectIds referencing courses
              bsonType: "array",
              items: {
                bsonType: "objectId",
                description: "must be an ObjectId referencing courses within this collection (hierarchical_units) if unitType is 'troop'",
              },
              description: "must be an array of ObjectIds referencing courses if unitType is 'troop'",
            },
            year: { // Group-specific
              bsonType: "int",
              description: "must be an integer if unitType is 'group'",
            },
            groupLeader: { // Group-specific, embedded Scout (already defined in groups.items.properties above)
              bsonType: "object",
              description: "must be an embedded Scout object if unitType is 'group'",
            },
            scouts: { // Group-specific, embedded Scouts (already defined in groups.items.properties above)
              bsonType: "array",
              description: "must be an array of embedded Scout objects if unitType is 'group'",
            },
            badge: { // Course-specific
              bsonType: "string",
              description: "must be a string if unitType is 'course'",
            },
            participants: { // Course-specific, array of ObjectIds referencing scouts
              bsonType: "array",
              items: {
                bsonType: "objectId",
                description: "must be an ObjectId referencing scouts collection if unitType is 'course'",
              },
              description: "must be an array of ObjectIds referencing scouts if unitType is 'course'",
            },
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });
    console.log("Created hierarchical_units collection");


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