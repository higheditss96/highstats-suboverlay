import React, { useEffect, useState } from "react";

function SubOverlay() {
  const params = new URLSearchParams(window.location.search);
  const user = params.get("user") || "hyghman";
  const color = params.get("color") || "#00ffaa";
  const goal = parseInt(params.get("goal")) || 100;
  const font = params.get("font") || "Poppins";
  const showPfp = params.get("showPfp") === "true";
  const goalColor = params.get("goalColor") || "#ffffff";

  const [subs, setSubs] = useState(0);
  const [goalProgress, setGoalProgress] = useState(0);
  const [pfp, setPfp] = useState("");
  const [status, setStatus] = useState("Connecting...");

  // Fetch channel info
  const fetchChannel = async () => {
    try {
      const res = await fetch(`https://kick.com/api/v1/channels/${user}`);
      const data = await res.json();
      setSubs(data.subscriberCount || 0);
      setPfp(data.user?.profile_pic || "");
    } catch (err) {
      console.error("Error fetching channel:", err);
    }
  };

  useEffect(() => {
    fetchChannel();
  }, [user]);

  // WebSocket connection
  useEffect(() => {
    let ws;
    let reconnectTimeout;

    const connectWS = () => {
      ws = new WebSocket("wss://ws.kick.com/chatroom/" + user);

      ws.onopen = () => {
        setStatus("✅ Connected to Kick WebSocket");
      };

      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);

          // detect subscription events
          if (
            data.event === "SubscriptionEvent" ||
            data.event === "GiftedSubscriptionEvent"
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
    };

    connectWS();

    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimeout);
    };
  }, [user]);

  // Update goal progress
  useEffect(() => {
    const percent = Math.min((subs / goal) * 100, 100);
    setGoalProgress(percent);
  }, [subs, goal]);

  return (
    <div
      style={{
        fontFamily: font,
        color: color,
        textAlign: "center",
        padding: "20px",
        background: "transparent",
      }}
    >
      {showPfp && pfp && (
        <img
          src={pfp}
          alt="pfp"
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            marginBottom: 10,
            border: `2px solid ${color}`,
          }}
        />
      )}

      <div
        style={{
          fontSize: "34px",
          fontWeight: 700,
          color: color,
          textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
        }}
      >
        SUB GOAL: {subs}/{goal}
      </div>

      <div
        style={{
          width: "80%",
          height: 8,
          background: "#222",
          borderRadius: 6,
          margin: "10px auto",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${goalProgress}%`,
            height: "100%",
            background: color,
            transition: "width 0.5s ease",
          }}
        ></div>
      </div>

      <div
        style={{
          color: goalColor,
          fontWeight: 600,
          fontSize: "14px",
          marginTop: 6,
          textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
        }}
      >
        🎯 {Math.max(goal - subs, 0)} left to {goal}
      </div>

      <div
        style={{
          fontSize: "12px",
          opacity: 0.7,
          marginTop: 8,
        }}
      >
        {status}
      </div>
    </div>
  );
}

export default SubOverlay;
