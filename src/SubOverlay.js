import React, { useEffect, useState } from "react";

function SubOverlay() {
  const [subs, setSubs] = useState(0);
  const [gifted, setGifted] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const user = params.get("user") || "hyghman";
  const color = params.get("color") || "#00ffaa";
  const font = params.get("font") || "Poppins";
  const goal = Number(params.get("goal")) || 1000;
  const goalColor = params.get("goalColor") || "#ffffff";

  // Fetch subs + gifted
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`https://kick.com/api/v2/channels/${user}`);
        const data = await res.json();

        const subCount = data.subscribers_count || 0;
        const giftedCount = data.subscriber_gifts_count || 0;

        setSubs(subCount);
        setGifted(giftedCount);
        setIsLoaded(true);
      } catch (err) {
        console.error("Eroare la Kick API:", err);
        setIsLoaded(true);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 15000); // refresh la 15 sec
    return () => clearInterval(interval);
  }, [user]);

  const totalSubs = subs + gifted;
  const progress = Math.min((totalSubs / goal) * 100, 100);
  const remaining = Math.max(goal - totalSubs, 0);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: font,
        color: color,
      }}
    >
      {!isLoaded ? (
        <p style={{ fontSize: "20px", opacity: 0.6 }}>Loading...</p>
      ) : (
        <>
          {/* Total subs (abonamente + gifted) */}
          <h1 style={{ fontSize: "80px", margin: "0", fontWeight: 900 }}>
            {totalSubs.toLocaleString()}
          </h1>

          <p style={{ fontSize: "28px", margin: "6px 0" }}>subs total</p>

          {/* Goal bar */}
          <div
            style={{
              width: "70%",
              maxWidth: "900px",
              height: "28px",
              borderRadius: "14px",
              backgroundColor: goalColor,
              overflow: "hidden",
              marginTop: "18px",
              position: "relative",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: color,
                transition: "width 0.6s ease-in-out",
              }}
            />
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontWeight: "bold",
                fontSize: "18px",
                color:
                  goalColor.toLowerCase() === "#ffffff" ||
                  goalColor.toLowerCase() === "white"
                    ? "#000"
                    : "#fff",
              }}
            >
              🎯 {remaining.toLocaleString()} left to {goal.toLocaleString()}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default SubOverlay;
