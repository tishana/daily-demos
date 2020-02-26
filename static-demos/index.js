const handler = require("serve-handler");

module.exports = async (req, res) => {
  console.log(req.url);
  await handler(req, res, {
    public: "../",
    cleanUrls: false,
    unlisted: [
      "index.js",
      "package.json",
      "package-lock.json",
      "doc-site-assets",
      "node_modules"
    ]
  });
};
