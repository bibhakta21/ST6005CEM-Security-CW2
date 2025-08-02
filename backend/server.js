const fs = require("fs");
const https = require("https");
const app = require("./app");

const PORT = process.env.PORT || 3000;

const sslOptions = {
  key: fs.readFileSync("../ssl/key.pem"),
  cert: fs.readFileSync("../ssl/cert.pem"),
};

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running on https://localhost:${PORT}`);
});
