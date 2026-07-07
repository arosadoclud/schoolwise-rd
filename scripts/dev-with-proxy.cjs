// Supervisor-managed launcher for the Lovable TanStack app.
// Starts vite dev (forced to 8080 by @lovable.dev config) and a TCP proxy on
// 3000 so the Emergent ingress (port 3000) can reach it. Keeps both alive.
const { spawn } = require("child_process");
const net = require("net");
const path = require("path");

const APP_DIR = path.resolve(__dirname, "..");

// --- TCP proxy 3000 -> 8080 (transparent, supports HMR websockets) ---
function startProxy() {
  const server = net.createServer((client) => {
    const upstream = net.connect(8080, "127.0.0.1");
    client.on("error", () => upstream.destroy());
    upstream.on("error", () => client.destroy());
    client.pipe(upstream);
    upstream.pipe(client);
  });
  server.on("error", (e) => {
    console.error("[proxy] error", e.message);
    setTimeout(startProxy, 1000);
  });
  server.listen(3000, "0.0.0.0", () => console.log("[proxy] 3000 -> 8080 ready"));
}

startProxy();

// --- vite dev ---
const vite = spawn("yarn", ["dev"], {
  cwd: APP_DIR,
  stdio: "inherit",
  env: { ...process.env },
});

vite.on("exit", (code) => {
  console.error(`[vite] exited with code ${code}`);
  process.exit(code ?? 1);
});

process.on("SIGTERM", () => vite.kill("SIGTERM"));
process.on("SIGINT", () => vite.kill("SIGINT"));
