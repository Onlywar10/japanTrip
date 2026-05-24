// Throwaway diagnostic: server-side put() to confirm the public store accepts uploads.
import { readFileSync } from "node:fs";
import { put, list, del } from "@vercel/blob";

// Minimal .env.local loader (no dotenv dependency).
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (!m) continue;
  let v = m[2].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  if (!process.env[m[1]]) process.env[m[1]] = v;
}

console.log("token prefix:", process.env.BLOB_READ_WRITE_TOKEN?.slice(0, 18));

try {
  console.log("\n-- put() --");
  const res = await put(`photos/_diag-${Date.now()}.txt`, "hello blob", {
    access: "public",
    addRandomSuffix: true,
  });
  console.log("put OK:", res.url);

  // Confirm the public URL is actually readable without a token.
  const r = await fetch(res.url);
  console.log("public fetch status:", r.status, "->", (await r.text()).slice(0, 20));

  // Clean up the test object.
  await del(res.url);
  console.log("cleaned up test blob");
} catch (e) {
  console.error("put FAILED:", e?.name, e?.message);
  if (e?.cause) console.error("cause:", e.cause);
}
