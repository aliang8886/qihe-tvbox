import fs from "node:fs";
const base = JSON.parse(fs.readFileSync("启禾影视.json", "utf8"));
const { devices } = JSON.parse(fs.readFileSync("devices.json", "utf8"));
fs.mkdirSync("devices", { recursive: true });
const known = new Set(devices.map((d) => `${d.id}.json`));
for (const old of fs.readdirSync("devices")) if (!known.has(old)) fs.rmSync(`devices/${old}`);
for (const device of devices) {
  const valid = device.enabled && Date.parse(device.expiresAt) > Date.now();
  const output = valid
    ? { ...base, name: `启禾影视｜${device.name}`, device: { name: device.name, expiresAt: device.expiresAt } }
    : { name: `启禾影视｜${device.enabled ? "已到期" : "已停用"}`, device: { name: device.name, expiresAt: device.expiresAt }, spider: "", sites: [], lives: [] };
  fs.writeFileSync(`devices/${device.id}.json`, JSON.stringify(output, null, 2) + "\n");
}
