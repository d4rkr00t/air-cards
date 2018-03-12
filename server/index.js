let Koa = require("koa");
let { createBase, fetchAllRecords } = require("./airtable");
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

app.use(async ctx => {
  ctx.response.type = "json";

  const words = await fetchAllRecords(base, "Words");
  const idioms = await fetchAllRecords(base, "Idioms");
  const phrases = await fetchAllRecords(base, "Phrases");
  const phrasalVerbs = await fetchAllRecords(base, "Phrasal Verbs");

  ctx.body = JSON.stringify({ words, idioms, phrases, phrasalVerbs });
});

app.listen(3000);
