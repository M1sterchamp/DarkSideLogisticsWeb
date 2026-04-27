import fs from "node:fs";

const API_URL = "https://api.truckersmp.com/v2/vtc/88413/partners";

const res = await fetch(API_URL, { headers: { Accept: "application/json" } });
if (!res.ok) {
  const text = await res.text().catch(() => "");
  throw new Error(`Upstream error: ${res.status} ${text.slice(0, 2000)}`);
}

const json = await res.json();

// Keep frontend-compatible shape
const output = { partners: json.partners ?? json.data ?? json };

fs.writeFileSync(
  "partners-data.json",
  JSON.stringify(output, null, 2),
  "utf8"
);

console.log("Wrote partners-data.json");