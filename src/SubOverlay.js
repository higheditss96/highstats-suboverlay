import React, { useEffect, useState } from "react";
import "./SubOverlay.css";

function SubOverlay() {
  const params = new URLSearchParams(window.location.search);
  const user = params.get("user") || "anduu14";
  const goal = Number(params.get("goal")) || 100;
  const color = params.get("color") || "#00ffaa";
  const font = params.get("font") || "Poppins";
  const showPfp = params.get("showPfp") === "true";
  const backendURL = params.get("backend") || "http://localhost:3001";

  const [subs, setSubs] = useState(0);
  const [pfp, setPfp] = useState("");
  const [status, setStatus] = useState("Connecting to backend...");

  useEffect(() => {
    async function fetchChannel() {
      try {
        const res = await fetch(`https://kick.com/api/v1/channels/${user}`);
        const data = await res.json();
        if (data.user?.profile_pic) setPfp(data.user.profile_pic);
      } catch (err) {
        console.log("❌ Error fetching channel:", err);
      }
    }
    fetchChannel();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${backendURL}/subs`);
        const data = await res.json();
        setSubs(data.total || 0);
        setStatus("✅ Live connection active");
      } catch {
        setStatus("⚠️ Disconnected from backend");
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [backendURL]);

  const progress = Math.min((subs / goal) * 100, 100);

  return (
    <div className="suboverlay-container" style={{ fontFamily: font }}>
      {showPfp && pfp && <img src={pfp} alt="channel" className="suboverlay-pfp" />}

      <div className="suboverlay-text">
        <span className="suboverlay-label">SUB GOAL:</span>{" "}
        <span className="suboverlay-count" style={{ color }}>
          {subs}/{goal}
        </span>
      </div>

      <div className="suboverlay-bar-bg">
        <div
          className="suboverlay-bar-fill"
          style={{ width: `${progress}%`, backgroundColor: color }}
        ></div>
      </div>

      <div className="suboverlay-status">{status}</div>
    </div>
  );
}

export default SubOverlay;
