require("dotenv").config();
require("./config/connectDB");
const http = require("http");
const app = require("./app/app");
const server = http.createServer(app);
const PORT = process.env.PORT || 3800;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
