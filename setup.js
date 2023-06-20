const fs = require('fs');
const path = require('path');
const child_process = require("child_process");

if (fs.existsSync(path.join(__dirname, "/package-lock.json"))) {
  child_process.execSync("npm ci", { cwd: __dirname });
}
