import React, { useEffect, useState } from "react";

function SubOverlay() {
  const [subs, setSubs] = useState(0);
  const [goal, setGoal] = useState(100);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Preluăm parametrii din URL
  const params = new URLSearchParams(window.location.search);
  const username = params.get("user") || "hyghman";
  const color = params.get("color") || "#00ffaa";
  const font = params.get("font") || "Poppins";
  const goalParam = Number(params.get("goal")) || 100;

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await fetch(`https://kick.com/api/v2/channels/${username}`);
        if (!res.ok) throw new Error("Failed to fetch channel data");
        const data = await res.json();

        const subCount = data?.subscribers_count ?? 0;
        setSubs(subCount);
        setGoal(goalParam);
      } catch (err) {
        console.error("Eroare la preluarea subs:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSubs();
    const interval = setInterval(fetchSubs, 15000);
    return () => clearInterval(interval);
  }, [username, goalParam]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: font,
          color: color,
          fontSize: "28px",
          fontWeight: "600",
        }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: font,
          color: "#ff4444",
          fontSize: "24px",
        }}
      >
        Failed to load subscriber data 😢
      </div>
    );
  }

  const remaining = Math.max(goal - subs, 0);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        color: color,
        fontFamily: font,
        textAlign: "center",
        transition: "all 0.3s ease",
      }}
    >
      <h1
        style={{
          fontSize: "70px",
          fontWeight: "900",
          margin: 0,
          textShadow: `0 0 20px ${color}60`,
        }}
      >
        {subs.toLocaleString()}
      </h1>
      <p
        style={{
          fontSize: "28px",
          fontWeight: "600",
          margin: 0,
          textShadow: `0 0 10px ${color}30`,
        }}
      >
        subs total
      </p>

      <div
        style={{
          marginTop: "30px",
          width: "60%",
          height: "20px",
          background: "#222",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${Math.min((subs / goal) * 100, 100)}%`,
            height: "100%",
            background: color,
            transition: "width 0.4s ease-in-out",
          }}
        ></div>
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#000",
            fontSize: "16px",
            fontWeight: "700",
            background: "rgba(255,255,255,0.7)",
            borderRadius: "4px",
            padding: "2px 8px",
          }}
        >
          {remaining > 0
            ? `${remaining.toLocaleString()} left to ${goal.toLocaleString()}`
            : "Goal reached!"}
        </span>
      </div>
    </div>
  );
}

export default SubOverlay;
