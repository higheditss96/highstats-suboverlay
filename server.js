// server.js — ascultă evenimente Kick realtime (subs/gifts)
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import { WebSocketServer } from "ws";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 4000;

// 🟢 Creează un server WebSocket pentru overlay
const wss = new WebSocketServer({ noServer: true });
let lastData = {};

wss.on("connection", (ws) => {
  console.log("Client connected to WS");
  ws.send(JSON.stringify({ type: "init", data: lastData }));
});

// 🟢 Ascultă conexiuni WebSocket
const server = app.listen(PORT, () => {
  console.log(`✅ Server live pe http://localhost:${PORT}`);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// 🔄 Periodic actualizează datele de la Kick
const CHANNEL = "hyghman"; // schimbă cu userul tău implicit

async function getKickData() {
  try {
    const res = await fetch(`https://kick.com/api/v2/channels/${CHANNEL}`);
    const data = await res.json();

    const info = {
      username: data.slug,
      subs: data.subscribers_count || 0,
      gifted: data.subscriber_gifts_count || 0,
      updatedAt: new Date().toISOString(),
    };

    lastData = info;
    // Trimite la toți clienții WS
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ type: "update", data: info }));
      }
    });

    console.log("🔁 Actualizat:", info);
  } catch (err) {
    console.error("❌ Eroare Kick API:", err);
  }
}

// Rulează la 10 secunde
setInterval(getKickData, 10000);
getKickData();

app.get("/", (req, res) => res.send("Kick Realtime API is running ✅"));
