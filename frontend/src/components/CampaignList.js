import React, { useEffect, useState } from "react";
import { getCampaigns, startCampaign } from "../api";
import { Link } from "react-router-dom";

const statusColors = {
  SCHEDULED: "#fbbf24", // amber-400
  DRAFT: "#a3a3a3",     // gray-400
  IN_PROGRESS: "#3b82f6", // blue-500
  COMPLETED: "#10b981",   // green-500
  FAILED: "#ef4444",      // red-500
};

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState(""); // new

  const fetchCampaigns = () => {
    setLoading(true);
    getCampaigns()
      .then((res) => {
        setCampaigns(res.data);
      })
      .catch((error) => {
        console.error("Error fetching campaigns:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleStartCampaign = async (campaignId) => {
    try {
      setLoading(true);
      await startCampaign(campaignId);
      alert("Campaign started successfully!");
      fetchCampaigns();
    } catch (error) {
      console.error("Error starting campaign:", error);
      alert("Failed to start campaign: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Filter campaigns based on selected status
  const filteredCampaigns = filterStatus
    ? campaigns.filter((c) => c.status === filterStatus)
    : campaigns;

  return (
    <div>
      <h2>All Campaigns</h2>
      {/* Filter Dropdown */}
      <label>
        Filter by status:{" "}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ marginBottom: "1rem" }}
        >
          <option value="">All</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="DRAFT">Draft</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </label>
      {loading && <p>Loading campaigns...</p>} {/* loading message */}
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#e5e7eb" }}>
            <th>Name</th>
            <th>Status</th>
            <th>Sent</th>
            <th>Failed</th>
            <th>Logs</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCampaigns.map((c) => (
            <tr key={c.id} style={{ background: "#f9fafb" }}>
              <td>{c.name}</td>
              <td style={{
                color: "white",
                background: statusColors[c.status] || "#d1d5db",
                fontWeight: "bold",
                borderRadius: "0.3rem",
                padding: "0.4em"
              }}>
                {c.status}
              </td>
              <td>{c.sent_count}</td>
              <td>{c.failed_count}</td>
              <td>
                <Link to={`/campaign/${c.id}/logs`}>View Logs</Link>
              </td>
              <td>
                {(c.status === "SCHEDULED" || c.status === "DRAFT") && (
                  <button
                    onClick={() => handleStartCampaign(c.id)}
                    disabled={loading}
                    style={{
                      background: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "0.3rem",
                      padding: "0.5em 1em",
                      cursor: "pointer"
                    }}
                  >
                    {loading ? "Starting..." : "Start Campaign"}
                  </button>
                )}
                {c.status === "IN_PROGRESS" && <span style={{ color: "#fbbf24" }}>In Progress</span>}
                {c.status === "COMPLETED" && <span style={{ color: "#10b981" }}>Completed</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
