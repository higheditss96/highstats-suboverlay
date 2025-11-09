import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

// ✅ CORS complet deschis
app.use(cors({ origin: "*", methods: ["GET"] }));

// ✅ Endpoint pentru overlay
app.get("/subs", async (req, res) => {
  try {
    const user = req.query.user || "anduu14";
    const response = await fetch(`https://kick.com/api/v1/channels/${user}`);
    const data = await response.json();

    const subs = data?.subscriptionsCount || 0;

    res.json({
      success: true,
      user,
      subs,
      total: subs,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("❌ Error fetching subs:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Backend online on port ${PORT}`));
