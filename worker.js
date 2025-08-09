import { exec } from "child_process";

console.log("Worker started");

exec("npm run test:ssn", (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) console.error(`stderr: ${stderr}`);
  console.log(stdout);
});
