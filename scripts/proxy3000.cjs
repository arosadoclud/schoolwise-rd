// Transparent TCP proxy: listens on 3000, forwards to vite dev on 8080.
// Lovable's vite config hard-forces port 8080 (strictPort) in the sandbox,
// but the Emergent ingress targets port 3000. This bridges the two.
const net = require("net");

const LISTEN_PORT = 3000;
const TARGET_HOST = "127.0.0.1";
const TARGET_PORT = 8080;

const server = net.createServer((client) => {
  const upstream = net.connect(TARGET_PORT, TARGET_HOST);
  client.on("error", () => upstream.destroy());
  upstream.on("error", () => client.destroy());
  client.pipe(upstream);
  upstream.pipe(client);
});

server.listen(LISTEN_PORT, "0.0.0.0", () => {
  console.log(`proxy listening on ${LISTEN_PORT} -> ${TARGET_HOST}:${TARGET_PORT}`);
});
