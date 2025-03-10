import { fillCollections } from "./fillSchema";
import { queryCollections } from "./queryCollections";
import { updateCollections } from "./updateCollections";
import { deleteCollections } from "./deleteCollections";
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

export { runAll };
runAll().catch(console.error);
