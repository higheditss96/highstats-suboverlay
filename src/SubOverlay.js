import React, { useEffect, useState } from "react";
import "./SubOverlay.css";

function SubOverlay() {
  const params = new URLSearchParams(window.location.search);
  const user = params.get("user") || "hyghman";
  const goal = Number(params.get("goal")) || 100;
  const color = params.get("color") || "#00ffaa";
  const font = params.get("font") || "Poppins";
  const showPfp = params.get("showPfp") === "true";
  const debugMode = params.get("debug") === "true";

  const [subs, setSubs] = useState(0);
  const [pfp, setPfp] = useState("");
  const [status, setStatus] = useState("Connecting to Kick WebSocket...");

  useEffect(() => {
    let ws;
    let reconnectTimeout;

    const connectWS = async () => {
      try {
        const res = await fetch(`https://kick.com/api/v1/channels/${user}`);
        const data = await res.json();

        if (!data.chatroom?.id) {
          setStatus("❌ No chatroom ID found for this user.");
          return;
        }

        const chatroomId = data.chatroom.id;
        setPfp(data.user.profile_pic);

        ws = new WebSocket(`wss://ws.kick.com/chatroom/${chatroomId}`);

        ws.onopen = () => {
          setStatus("✅ Connected to Kick WebSocket");
        };

        ws.onmessage = (msg) => {
          try {
            const event = JSON.parse(msg.data);

            if (
              event.event === "SubscriptionEvent" ||
              event.event === "GiftedSubscriptionEvent"
            ) {
              setSubs((prev) => prev + 1);
            }
          } catch (err) {
            console.error("WebSocket message error:", err);
          }
        };

        ws.onclose = () => {
          setStatus("⚠️ WS closed, retrying in 5s...");
          reconnectTimeout = setTimeout(connectWS, 5000);
        };

        ws.onerror = () => {
          setStatus("❌ WebSocket error, retrying...");
          ws.close();
        };
      } catch (err) {
        setStatus("❌ Failed to connect to Kick WS");
      }
    };

    connectWS();

    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimeout);
    };
  }, [user]);

  // Debug mode for local testing (press D to add subs)
  useEffect(() => {
    if (debugMode) {
      const handleKey = (e) => {
        if (e.key.toLowerCase() === "d") {
          setSubs((s) => s + 1);
        }
      };
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  }, [debugMode]);

  const progress = Math.min((subs / goal) * 100, 100);

  return (
    <div
      className="suboverlay-container"
      style={{
        fontFamily: font,
        color: color,
      }}
    >
      {showPfp && pfp && (
        <img src={pfp} alt="channel" className="suboverlay-pfp" />
      )}

      <div className="suboverlay-text">
        <span className="suboverlay-label">SUB GOAL:</span>{" "}
        <span className="suboverlay-count">
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
