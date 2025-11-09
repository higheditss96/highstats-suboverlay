import React, { useEffect, useState } from "react";

// === Import Google Fonts ===
const fontsLink = document.createElement("link");
fontsLink.href =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&family=Outfit:wght@400;700;900&family=Orbitron:wght@500;700&family=Montserrat:wght@600;900&family=Inter:wght@500;800&display=swap";
fontsLink.rel = "stylesheet";
document.head.appendChild(fontsLink);

function SubOverlay() {
  const [subs, setSubs] = useState(0);
  const [gifted, setGifted] = useState(0);
  const [profilePic, setProfilePic] = useState("");
  const [debug, setDebug] = useState("Loading...");

  // === URL parameters ===
  const params = new URLSearchParams(window.location.search);
  const user = params.get("user") || "hyghman";
  const color = params.get("color") || "#00ffaa";
  const font =
    params.get("font") ||
    "Poppins, Outfit, Montserrat, Orbitron, Inter, sans-serif";
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
        textAlign: "center",
      }}
    >
      {/* Profile Picture */}
      {showPfp && profilePic && (
        <img
          src={profilePic}
          alt="profile"
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            marginBottom: "14px",
            boxShadow: `0 0 18px ${color}90`,
          }}
        />
      )}

      {/* Sub Goal Text */}
      <div
        style={{
          fontSize: "40px",
          fontWeight: "900",
          textShadow: `0 0 15px ${color}70`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          fontFamily: `"Outfit", "Poppins", "Orbitron", sans-serif`,
        }}
      >
        <span style={{ opacity: 0.9 }}>SUB GOAL:</span>
        <span>{total}/{goal}</span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "250px",
          height: "8px",
          borderRadius: "10px",
          background: "#1a1a1a",
          marginTop: "10px",
          overflow: "hidden",
          boxShadow: `0 0 10px ${color}40 inset`,
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}, #00ffbb, ${color})`,
            transition: "width 0.8s ease-in-out",
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      </div>

      {/* Debug Info (optional, ascunde în OBS) */}
      <div
        style={{
          marginTop: "12px",
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
