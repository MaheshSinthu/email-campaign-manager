import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import CampaignList from "./components/CampaignList";
import CampaignCreate from "./components/CampaignCreate";
import RecipientUpload from "./components/RecipientUpload";
import CampaignLogs from "./components/CampaignLogs";
import RecipientList from "./components/RecipientList";
function App() {
  const navStyle = {
    backgroundColor: "#2563eb",
    padding: "12px 24px",
    color: "white",
    marginBottom: "20px",
    borderRadius: "6px",
    fontSize: "1.1rem",
  };

  const containerStyle = {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "0 20px",
  };

  return (
    <BrowserRouter>
      <div style={containerStyle}>
        <nav style={navStyle}>
          <CustomNavLink to="/" text="Campaigns" />
          <CustomNavLink to="/create" text="Create Campaign" />
          <CustomNavLink to="/recipients" text="Upload Recipients" />
          <CustomNavLink to="/recipients-list" text="View Recipients" />
        </nav>

        <Routes>
          <Route path="/" element={<CampaignList />} />
          <Route path="/create" element={<CampaignCreate />} />
          <Route path="/recipients" element={<RecipientUpload />} />
          <Route path="/recipients-list" element={<RecipientList />} />
          <Route path="/campaign/:id/logs" element={<CampaignLogs />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const CustomNavLink = ({ to, text }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const baseStyle = {
    color: "white",
    textDecoration: "none",
    marginRight: "16px",
    padding: "4px 8px",
    borderRadius: "4px",
    transition: "background-color 0.2s ease",
  };

  const activeStyle = {
    backgroundColor: "#1e40af",
    fontWeight: "bold",
  };

  const [hover, setHover] = React.useState(false);

  const hoverStyle = hover && !isActive ? { backgroundColor: "#3b82f6" } : {};

  return (
    <Link
      to={to}
      style={{ ...baseStyle, ...hoverStyle, ...(isActive ? activeStyle : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {text}
    </Link>
  );
};

export default App;
