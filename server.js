const { isProbablyReaderable, Readability } = require("@mozilla/readability");
const express = require("express");
const bodyParser = require("body-parser");
const { JSDOM } = require("jsdom");
const yargs = require("yargs");

const app = express();

const argv = yargs.option("port", {
  alias: "p",
  description: "Specify port",
  type: Number,
  default: 5052,
}).argv;

const port = argv.port;

app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.post("/read", (req, res) => {
  const url = req.body?.url;
  const html = req.body?.html;

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
