let path = require("path");
let Koa = require("koa");
let serve = require("koa-static");
let { createBase, fetchAllRecords } = require("./airtable");
let { template } = require("./template");
let key = process.env.API_KEY || require("../key");
let app = new Koa();
let baseId = process.env.BASE || "app4lM53g6kt4kZci";
let base = createBase(key, baseId);

// Static

app.use(serve(path.join(__dirname, "public")));

// x-response-time

app.use(async (ctx, next) => {
  let start = Date.now();
  await next();
  let ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

// logger

app.use(async (ctx, next) => {
  let start = Date.now();
  await next();
  let ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

let withCategory = (list, Category) =>
  list.map(item => Object.assign({ Category }, item));

let pickRandom = list => list[Math.floor(Math.random() * list.length)];

let prevPicks = [];

app.use(async ctx => {
  ctx.response.type = "html";

  let words = await fetchAllRecords(base, "Words");
  let idioms = await fetchAllRecords(base, "Idioms");
  let phrases = await fetchAllRecords(base, "Phrases");
  let phrasalVerbs = await fetchAllRecords(base, "Phrasal Verbs");

  let allRecords = withCategory(words, "words")
    .concat(withCategory(idioms, "idioms"))
    .concat(withCategory(phrases, "phrases"))
    .concat(withCategory(phrasalVerbs, "phrasal verbs"));

  let record = pickRandom(allRecords);

  while (prevPicks.indexOf(record.id) !== -1) {
    record = pickRandom(allRecords);
  }

  prevPicks = [record.id].concat(
    prevPicks.slice(0, Math.floor(allRecords.length / 3))
  );

  ctx.body = template(record);
});

app.listen(3000);
