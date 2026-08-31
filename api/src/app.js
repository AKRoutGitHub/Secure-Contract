const express = require("express");
const path = require("path");

const config = require("./config/env");
const auditRoutes = require("./routes/audit.routes");

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.static(path.resolve(__dirname, "../../")));

app.use("/api/audits", auditRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.listen(config.PORT, () => {
  console.log(`Server listening on http://localhost:${config.PORT}`);
});
