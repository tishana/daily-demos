const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

app.use(
  "/static-demos",
  createProxyMiddleware({
    target: "http://localhost:3001"
  })
);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
