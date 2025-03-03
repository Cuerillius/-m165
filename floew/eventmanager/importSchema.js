const { MongoClient } = require("mongodb");

// Function to create collections with validation schemas
async function createCollections() {
  // Connect to MongoDB (assumes a local instance at default port)
  const client = new MongoClient("mongodb://link");
  try {
    await client.connect();
    const db = client.db("event_management");
    console.log("Connected to MongoDB");

    // List of collections to drop and recreate
    const collections = [
      "organisations",
      "events",
      "signUpParticipants",
      "eventManagers",
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

    // 1. Create Organisations collection
    await db.createCollection("organisations", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "contact"],
          properties: {
            name: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            address: {
              bsonType: "string",
              description: "must be a string if present",
            },
            contact: {
              bsonType: "object",
              required: ["name", "email"],
              properties: {
                name: {
                  bsonType: "string",
                  description: "must be a string and is required",
                },
                email: {
                  bsonType: "string",
                  description: "must be a string and is required",
                },
                phone: {
                  bsonType: "string",
                  description: "must be a string if present",
                },
              },
            },
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });
    console.log("Created organisations collection");

    // 2. Create Events collection
    await db.createCollection("events", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["date", "title", "description"],
          properties: {
            date: {
              bsonType: "date",
              description: "must be a date and is required",
            },
            title: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            description: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            signups: {
              bsonType: "array",
              items: {
                bsonType: "objectId",
                description: "must be an ObjectId",
              },
              description: "array of SignUpParticipant references",
            },
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });
    console.log("Created events collection");

    // 3. Create SignUpParticipants collection
    await db.createCollection("signUpParticipants", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["legalName", "attending"],
          properties: {
            legalName: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            nickName: {
              bsonType: "string",
              description: "must be a string if present",
            },
            note: {
              bsonType: "string",
              description: "must be a string if present",
            },
            attending: {
              bsonType: "bool",
              description: "must be a boolean and is required",
            },
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });
    console.log("Created signUpParticipants collection");

    // 4. Create EventManagers collection
    await db.createCollection("eventManagers", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["organisation"],
          properties: {
            organisation: {
              bsonType: "objectId",
              description: "must be an ObjectId and is required",
            },
            events: {
              bsonType: "array",
              items: {
                bsonType: "objectId",
                description: "must be an ObjectId",
              },
              description: "array of Event references",
            },
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });
    console.log("Created eventManagers collection");

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
