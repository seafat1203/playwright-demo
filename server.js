import express from "express";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

app.post("/run", async (req, res) => {
  // 触发 Playwright 测试命令
  exec("npx playwright test tests/ssn-booking-render.spec.ts --project=chromium --reporter=line", (error, stdout, stderr) => {
    if (error) {
      console.error(`执行失败: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`错误输出: ${stderr}`);
    }
    console.log(`执行结果: ${stdout}`);
  });

  res.status(202).send("Task started");
});

app.listen(PORT, () => {
  console.log(`Web service running on port ${PORT}`);
});
