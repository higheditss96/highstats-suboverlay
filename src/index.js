import React from "react";
import ReactDOM from "react-dom/client";
import SubOverlay from './SubOverlay';
ReactDOM.render(<SubOverlay />, document.getElementById('root'));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SubOverlay />
  </React.StrictMode>
);
