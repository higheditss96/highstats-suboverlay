import React, { useEffect, useState } from "react";

function SubOverlay() {
  const [subs, setSubs] = useState(0);
  const [gifted, setGifted] = useState(0);
  const [profilePic, setProfilePic] = useState("");
  const [debug, setDebug] = useState("Loading...");

  // === URL parameters ===
  const params = new URLSearchParams(window.location.search);
  const user = params.get("user") || "hyghman";
  const color = params.get("color") || "#00ffaa";
  const font = params.get("font") || "Bebas Neue";
  const goal = Number(params.get("goal")) || 10;
  const showPfp = params.get("showPfp") === "false" ? false : true;

  // === Fetch from Kick API ===
  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await fetch(`https://kick.com/api/v2/channels/${user}`);
        const data = await res.json();

        setSubs(data.subscribers_count ?? 0);
        setGifted(data.subscriber_gifts_count ?? 0);
        setProfilePic(data.user?.profile_pic || "");
        setDebug(`✅ Updated at ${new Date().toLocaleTimeString()}`);
      } catch (err) {
        console.error("Kick API error:", err);
        setDebug(`❌ API error: ${err.message}`);
      }
    };

    fetchSubs();
    const interval = setInterval(fetchSubs, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const total = subs + gifted;
  const progress = Math.min((total / goal) * 100, 100);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color,
        fontFamily: font,
        textTransform: "uppercase",
        letterSpacing: "1px",
      }}
    >
      {/* Profile Picture */}
      {showPfp && profilePic && (
        <img
          src={profilePic}
          alt="profile"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            marginBottom: "12px",
            boxShadow: `0 0 12px ${color}70`,
          }}
        />
      )}

      {/* Sub Goal Text */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          fontSize: "38px",
          fontWeight: "900",
          textShadow: `0 0 10px ${color}80`,
        }}
      >
        <span style={{ opacity: 0.9 }}>SUB GOAL:</span>
        <span>{total}/{goal}</span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "220px",
          height: "8px",
          borderRadius: "5px",
          background: "#202020",
          marginTop: "8px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: color,
            transition: "width 0.8s ease-in-out",
          }}
        />
      </div>

      {/* Debug Info (optional, ascunde în OBS) */}
      <div
        style={{
          marginTop: "10px",
          fontSize: "12px",
          opacity: 0.5,
          fontFamily: "monospace",
        }}
      >
        {debug}
      </div>
    </div>
  );
}

export default SubOverlay;
