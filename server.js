import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

let lastSubs = 0;
let lastGifted = 0;

// actualizare la 3s
async function updateStats(user) {
  try {
    const res = await fetch(`https://kick.com/api/v1/channels/${user}`);
    const data = await res.json();

    const subCount = data.subscriber_badges?.length
      ? data.subscriber_badges.reduce((acc, x) => acc + (x.subscriptions_count || 0), 0)
      : data.subscriptionsCount || 0;

    lastSubs = subCount || 0;
  } catch (err) {
    console.error("❌ Error fetching channel:", err.message);
  }
}

// endpoint pentru frontend
app.get("/subs", async (req, res) => {
  const user = req.query.user || "anduu14";
  await updateStats(user);
  res.json({
    subs: lastSubs,
    gifted: lastGifted,
    total: lastSubs + lastGifted,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
