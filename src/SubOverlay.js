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
            objectFit: "cover",
            boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
          }}
        />
      )}

      {/* Sub Goal Text */}
      <div
        style={{
          fontSize: "42px",
          fontWeight: "900",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          fontFamily: `"Outfit", "Poppins", "Orbitron", sans-serif`,
          filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.6))",
        }}
      >
        <span style={{ opacity: 0.85 }}>SUB GOAL:</span>
        <span>{total}/{goal}</span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "250px",
          height: "10px",
          borderRadius: "8px",
          background: "#181818",
          marginTop: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: color,
            transition: "width 0.8s ease-in-out",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      {/* Debug Info */}
      <div
        style={{
          marginTop: "14px",
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
