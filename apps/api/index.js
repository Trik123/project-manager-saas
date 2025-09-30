// apps/api/index.js
import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

app.listen(3001, () => {
  console.log("API running at http://localhost:3001");
});

