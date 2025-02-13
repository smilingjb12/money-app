import { nextEnv } from "./nextEnv";

export function register() {
  ensureEnvVariablesAreSet();
}

function ensureEnvVariablesAreSet(): void {
  console.log("Checking environment variables");
  const missingVars: string[] = [];

  for (const [key, value] of Object.entries(nextEnv)) {
    if (value == null) {
      missingVars.push(key);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing environment variables:\n${missingVars.map((key) => `  - ${key}`).join("\n")}`
    );
  }
}
