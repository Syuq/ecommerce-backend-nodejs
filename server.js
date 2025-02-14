const app = require("./src/app");
const PORT = 3055;

const server = app.listen(PORT, () => {
  console.log("Server running on port $PORT");
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(1);
  });
});

// process.on("unhandledRejection", (err, promise) => {
//   console.log(`Error: ${err.message}`);
//   server.close(() => process.exit(1));
// }