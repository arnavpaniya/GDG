const app = require("./src/app");
const { PORT } = require("./src/config/env");

const port = process.env.PORT || PORT || 8080;

app.listen(port, () => {
  console.log(`\n🚀 Nyaya AI Backend running on port ${port}`);
  console.log(`Environment : ${process.env.NODE_ENV || "development"}\n`);
});