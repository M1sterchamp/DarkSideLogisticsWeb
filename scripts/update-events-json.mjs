import fs from "node:fs";

const API_URL = "https://api.truckersmp.com/v2/vtc/88413/events/attending";

const res = await fetch(API_URL, {
  method: "GET",
  headers: { Accept: "application/json" },
});

if (!res.ok) {
  const text = await res.text().catch(() => "");
  throw new Error(`Upstream error: HTTP ${res.status} ${text.slice(0, 2000)}`);
}

const json = await res.json();

// The sample you pasted shows: { error:false, response:[ ...events ] }
const upstreamEvents = Array.isArray(json?.response)
  ? json.response
  : Array.isArray(json?.data)
    ? json.data
    : [];

const events = upstreamEvents
  .map((ev) => {
    const start = ev?.start_at;
    const url = ev?.url || null;
    const title = ev?.name || "Event";
    if (!start) return null;

    return {
      id: ev?.id ?? undefined,
      title,
      start,
      ...(url ? { url } : {}),
    };
  })
  .filter(Boolean);

// FullCalendar works great with ISO-ish strings.
// We’ll output as:
// { data: [ {id,title,start,url?}, ... ] }
const out = { data: events };

fs.writeFileSync("events-data.json", JSON.stringify(out, null, 2), "utf8");
console.log(`Wrote events-data.json (${events.length} events)`);