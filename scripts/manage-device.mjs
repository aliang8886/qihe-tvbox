import fs from "node:fs";
import crypto from "node:crypto";

const [action, idInput, nameInput, daysInput, enabledInput] = process.argv.slice(2);
const file = "devices.json";
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const now = new Date();

if (action === "upsert") {
  const id = (idInput || crypto.randomBytes(6).toString("hex")).replace(/[^a-zA-Z0-9_-]/g, "");
  if (!id) throw new Error("设备编号不能为空");
  const days = Math.max(1, Number(daysInput || 30));
  const expiresAt = new Date(now.getTime() + days * 86400000).toISOString();
  const found = data.devices.find((d) => d.id === id);
  const device = { id, name: nameInput || id, enabled: enabledInput !== "false", expiresAt };
  found ? Object.assign(found, device) : data.devices.push(device);
  console.log(`设备接口: https://raw.githubusercontent.com/aliang8886/qihe-tvbox/main/devices/${id}.json`);
} else if (action === "disable" || action === "enable") {
  const found = data.devices.find((d) => d.id === idInput);
  if (!found) throw new Error(`找不到设备: ${idInput}`);
  found.enabled = action === "enable";
} else {
  throw new Error("未知操作");
}

fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
