import { MongoClient } from "mongodb";

// Function to create collections with validation schemas
async function createCollections() {
  // Connect to MongoDB (assumes a local instance at default port)
  const client = new MongoClient(
    "mongodb://admin:!12345678!@51.107.25.23:27017"
  );
  try {
    await client.connect();
    const db = client.db("event_management");
    console.log("Connected to MongoDB");

    // Function to get the validator for a collection
    const getValidator = (collectionName: string) => {
      switch (collectionName) {
        case "organisations":
          return {
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
          };
        case "events":
          return {
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
          };
        case "signUpParticipants":
          return {
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
          };
        case "eventManagers":
          return {
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
          };
        default:
          return {};
      }
    };

    // List of collections to drop and recreate
    const collections = [
      "organisations",
      "events",
      "signUpParticipants",
      "eventManagers",
    ];

    // Drop and recreate collections
    for (const collectionName of collections) {
      try {
        await db.collection(collectionName).drop();
        console.log(`Dropped collection ${collectionName}`);
      } catch (error) {
        // Ignore error if collection doesn't exist
        if (error.codeName !== "NamespaceNotFound") {
          console.error(`Error dropping collection ${collectionName}:`, error);
        }
      }

      await db.createCollection(collectionName, {
        validator: getValidator(collectionName),
        validationLevel: "strict",
        validationAction: "error",
      });
      console.log(`Created ${collectionName} collection`);
    }

    // Log that all collections have been handled
    console.log("All collections handled.");
  } catch (error) {
    console.error("Error creating collections:", error);
  } finally {
    // Close the connection
    await client.close();
    console.log("MongoDB connection closed");
  }
}

export { createCollections };
