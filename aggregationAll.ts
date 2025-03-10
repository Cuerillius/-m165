import { aggregate_queries } from "./aggregation_queries";
import { importAggregationData } from "./importData";
async function runAll() {
  try {
    await importAggregationData();
    console.log("importSchema completed");

    await aggregate_queries();
    console.log("aggregate completed");

    console.log("All scripts completed");
  } catch (error) {
    console.error("Error running scripts:", error);
  }
}

runAll().catch(console.error);
