let fs = require("fs");
let path = require("path");

function renderCategoryAndType(category, type) {
  return category
    ? `<div class="card__category">[${category}] ${
        type ? `<span class="card__type">[${type}]</span>` : ""
      }</div>`
    : "";
}

function renderName(name, dictionary) {
  return name
    ? `<h1 class="card__name"><a href="${dictionary || "#"}" ${
        dictionary ? 'target="_blank"' : ""
      }>${name}</a></h1>`
    : "";
}

function renderDefinition(definition) {
  return definition ? `<p class="card__definition">${definition}</p>` : "";
}

function renderExamples(examples) {
  if (!examples) return "";
  let examplesByLine = examples
    .split("\n")
    .map(line => line.replace(/^[^\w\d]+/gi, ""));
  return `<ul class="card__examples">${examplesByLine
    .map(line => line.trim())
    .filter(line => !!line)
    .map(line => `<li>${line}</li>`)
    .join("\n")}</ul>`;
}

function template(record) {
  let styles = fs.readFileSync(path.join(__dirname, "style.css"), "utf8");
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="manifest" href="manifest.json">
  <link rel="apple-touch-icon" href="apple-touch-icon.png">
  <title>Aircards</title>
  <style>${styles}</style>
</head>
<body>
  <div class="card-wrapper">
    <div class="card">
      ${renderCategoryAndType(record.Category, record.Type)}
      ${renderName(record.Name, record.Dictionary)}
      ${renderDefinition(record.Definition)}
      ${renderExamples(record.Examples)}
    </div>
  </div>
</body>
</html>`;
}

module.exports = { template };
