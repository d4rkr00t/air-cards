const Airtable = require("airtable");
const cache = new Map();

function createBase(apiKey, baseId) {
  return new Airtable({ apiKey }).base(baseId);
}

function fetchAllRecords(airtable, base) {
  return new Promise((resolve, reject) => {
    let allRecords = [];
    let cachedRecords = cache.get(base);

    if (
      cachedRecords &&
      Date.now() - cachedRecords.timestamp < 60 * 60 * 1 * 1000
    ) {
      return resolve(cachedRecords.records);
    }

    if (cachedRecords) {
      resolve(cachedRecords.records);
    }

    airtable(base)
      .select({
        maxRecords: 100,
        sort: [{ field: "Memorized", direction: "asc" }]
      })
      .eachPage(
        (records, fetchNextPage) => {
          allRecords = allRecords.concat(records);
          fetchNextPage();
        },
        err => {
          if (err) return reject(err);
          let records = allRecords.map(rec =>
            Object.assign({}, rec.fields, { id: rec.id })
          );
          cache.set(base, {
            timestamp: Date.now(),
            records
          });

          if (!cachedRecords) {
            resolve(records);
          }
        }
      );
  });
}

module.exports = { createBase, fetchAllRecords };
