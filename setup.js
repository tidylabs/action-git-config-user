import { existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

if (existsSync(join(__dirname, "/package-lock.json"))) {
  execSync("npm ci --omit optional", { cwd: __dirname });
}
