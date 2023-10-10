const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");
const mime = require("mime");

const server = express();

// Serve static files from the 'public' directory
server.use(express.static("public"));

// Configure proxy for '/api' requests
server.use(
  "/api",
  createProxyMiddleware({
    target: "https://75f1b08b-e4e1-4506-af9e-8a4ed610dbb5.mock.pstmn.io/", // Specify your proxy target URL
    changeOrigin: true,
    logLevel: "debug",
    secure: false,
  })
);

// Serve index.html as the default file
server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/", "index.html"));
});

// Serve JavaScript files with the correct MIME type
server.get("*.js", (req, res, next) => {
  const filePath = path.join(__dirname, req.url);
  const mimeType = mime.getType(filePath);
  res.set("Content-Type", mimeType);
  next();
});

// Start the server
server.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
