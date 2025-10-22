import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CampaignList from "./components/CampaignList";
import CampaignCreate from "./components/CampaignCreate";
import RecipientUpload from "./components/RecipientUpload";
import CampaignLogs from "./components/CampaignLogs";

function App() {
  return (
    <BrowserRouter>
      <div className="p-4">
        <nav>
          <Link to="/">Campaigns</Link> |{" "}
          <Link to="/create">Create Campaign</Link> |{" "}
          <Link to="/recipients">Upload Recipients</Link>
        </nav>

        <Routes>
          <Route path="/" element={<CampaignList />} />
          <Route path="/create" element={<CampaignCreate />} />
          <Route path="/recipients" element={<RecipientUpload />} />
          <Route path="/campaign/:id/logs" element={<CampaignLogs />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
