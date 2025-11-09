import React, { useEffect, useState } from "react";

function SubOverlay() {
  const [subs, setSubs] = useState(0);
  const [loading, setLoading] = useState(true);

  // Citim parametrii din URL (trimiși de pe site)
  const params = new URLSearchParams(window.location.search);
  const username = params.get("user") || "hyghman";
  const color = params.get("color") || "#00ffaa";
  const font = params.get("font") || "Poppins";

  // ✅ Endpoint Kick API pentru informații despre canal (inclusiv subs)
  const fetchKickSubs = async () => {
    try {
      const response = await fetch(`https://kick.com/api/v2/channels/${username}`);
      const data = await response.json();

      // În Kick API, numărul de subs este în `subscribers_count` (uneori null)
      const subCount = data?.subscribers_count || 0;
      setSubs(subCount);
    } catch (error) {
      console.error("Eroare la preluarea subs:", error);
      setSubs(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKickSubs();
    const interval = setInterval(fetchKickSubs, 15000); // actualizare la 15 secunde
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent",
        fontFamily: font,
        color: color,
      }}
    >
      {loading ? (
        <p style={{ fontSize: "28px", fontWeight: 600 }}>Loading...</p>
      ) : (
        <>
          <h1
            style={{
              fontSize: "60px",
              fontWeight: "800",
              margin: 0,
              textShadow: `0px 0px 12px ${color}50`,
            }}
          >
            {subs.toLocaleString()}
          </h1>
          <p
            style={{
              fontSize: "24px",
              fontWeight: 500,
              marginTop: "4px",
              textShadow: `0px 0px 8px ${color}40`,
            }}
          >
            subs total
          </p>
        </>
      )}
    </div>
  );
}

export default SubOverlay;
