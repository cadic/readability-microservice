const { isProbablyReaderable, Readability } = require("@mozilla/readability");
const express = require("express");
const bodyParser = require("body-parser");

const { JSDOM } = require("jsdom");
const app = express();
const port = 5052;

app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.post("/read", (req, res, next) => {
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

app.listen(port);
