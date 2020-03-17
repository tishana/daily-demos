const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname, cacheControl: false });
});

// Static demos - match /static-demos

app.use(
  "/static-demos",
  createProxyMiddleware({
    target: "http://localhost:3001"
  })
);

// React demo - match /react-demo

app.use(
  "/react-demo",
  createProxyMiddleware({
    target: "http://localhost:3002"
  })
);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
