let Koa = require("koa");
let { createBase, fetchAllRecords } = require("./airtable");
let { template } = require("./template");
let key = require("../key");
let app = new Koa();
let base = createBase(key);

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

const withCategory = (list, Category) =>
  list.map(item => Object.assign({ Category }, item));

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

  let record = allRecords[Math.floor(Math.random() * allRecords.length)];

  ctx.body = template(record);
});

app.listen(3000);
