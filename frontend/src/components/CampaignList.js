import React, { useEffect, useState } from "react";
import { getCampaigns, startCampaign } from "../api";
import { Link } from "react-router-dom";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div>
      <h2>All Campaigns</h2>
      {loading && <p>Loading campaigns...</p>} {/* loading message */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Sent</th>
            <th>Failed</th>
            <th>Logs</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.status}</td>
              <td>{c.sent_count}</td>
              <td>{c.failed_count}</td>
              <td>
                <Link to={`/campaign/${c.id}/logs`}>View Logs</Link>
              </td>
              <td>
                {(c.status === "SCHEDULED" || c.status === "DRAFT") && (
                  <button onClick={() => handleStartCampaign(c.id)} disabled={loading}>
                    {loading ? "Starting..." : "Start Campaign"}
                  </button>
                )}
                {c.status === "IN_PROGRESS" && <span>In Progress</span>}
                {c.status === "COMPLETED" && <span>Completed</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}