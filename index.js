#!/usr/bin/env node
import { generateSlug } from "random-word-slugs";
import { execa } from "execa";

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const pm = getPackageManager();
  const initCommand = pm === "pnpm" ? "create" : "init";
  const nameSlug = generateSlug(3);

  const pkgManagerOption = `--use-${pm}`;

  await execa(
    pm,
    [
      initCommand,
      "next-app",
      nameSlug,
      "--ts",
      "--src-dir",
      pkgManagerOption,
      "--no-tailwind",
      "--eslint",
      "--app",
      '--import-alias="@/*"',
    ],
    {
      stdio: "inherit",
    }
  );

  await execa(pm, ["exec", "vercel", nameSlug], {
    stdio: "inherit",
  });
}

function getPackageManager() {
  if (!process.env.npm_config_user_agent) {
    console.warn("Warning: could not detect package manager");
    return "npm";
  }

  const pmPart = process.env.npm_config_user_agent.split(" ")[0];
  return pmPart.slice(0, pmPart.lastIndexOf("/"));
}
