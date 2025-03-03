import { fillCollections } from "./fillSchema";
import { queryCollections } from "./querySchema";
import { updateCollections } from "./updateSchema";
import { deleteCollections } from "./deleteSchema";
import { createCollections } from "./importSchema";

async function runAll() {
  try {
    await createCollections();
    console.log("importSchema completed");

    await fillCollections();
    console.log("fillCollections completed");

    await queryCollections();
    console.log("queryCollections completed");

    await updateCollections();
    console.log("updateCollections completed");

    await deleteCollections();
    console.log("deleteCollections completed");

    console.log("All scripts completed");
  } catch (error) {
    console.error("Error running scripts:", error);
  }
}

runAll().catch(console.error);
