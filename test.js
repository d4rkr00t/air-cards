const { createBase, fetchAllRecords } = require("./server/airtable");
const key = require("./key");

const base = createBase(key);

fetchAllRecords(base, "Words").then(records => console.log(records));
