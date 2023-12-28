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
  await execa(pm, [initCommand, "next-app", nameSlug], {
    stdio: "inherit",
  });

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

async function* chunksToLines(chunkIterable) {
  let previous = "";
  for await (const chunk of chunkIterable) {
    let startSearch = previous.length;
    previous += chunk;
    while (true) {
      const eolIndex = previous.indexOf("\n", startSearch);
      if (eolIndex < 0) break;
      // line includes the EOL
      const line = previous.slice(0, eolIndex + 1);
      yield line;
      previous = previous.slice(eolIndex + 1);
      startSearch = 0;
    }
  }
  if (previous.length > 0) {
    yield previous;
  }
}
