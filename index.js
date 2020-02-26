const express = require("express");
const proxy = require("http-proxy-middleware");
const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
