import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.post("/run", async (req, res) => {
  // 调用 Worker 的 URL
  await fetch(process.env.WORKER_URL, { method: "POST" });
  res.status(202).send("Task sent to worker");
});

app.listen(PORT, () => {
  console.log(`Web service running on port ${PORT}`);
});
