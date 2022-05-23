const { isProbablyReaderable, Readability } = require("@mozilla/readability");
const express = require("express");
const bodyParser = require("body-parser");
const { JSDOM } = require("jsdom");
const yargs = require("yargs");

const app = express();

const argv = yargs
  .option("port", {
    alias: "p",
    description: "Specify port",
    type: Number,
    default: process.env.READABILITY_PORT ?? 5052,
  })
  .option("key", {
    alias: "k",
    description: "API key",
    type: String,
    default: process.env.READABILITY_API_KEY ?? null,
  }).argv;

const port = argv.port;
const key = argv.key;

app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.post("/read", (req, res) => {
  if (key) {
    if (req.get("key") !== key) {
      res.json({ error: true, message: "Wrong API key" });
      return;
    }
  }

  const url = req.body?.url;
  const html = req.body?.html;

  if (!html || !url) {
    res.json({ error: true, message: "Wrong request" });
    return;
  }

  const doc = new JSDOM(html, { url: url });

  if (isProbablyReaderable(doc.window.document)) {
    const article = new Readability(doc.window.document).parse();
    res.json(article);
  } else {
    res.json({ error: true, message: "Document is not readable" });
  }
});

app.listen(port, () => {
  console.log(`Readability listen on port ${port}`);
});
