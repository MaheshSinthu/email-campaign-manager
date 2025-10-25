import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCampaignLogs } from "../api";

const statusColors = {
  SUCCESS: "#10b981", // Green-500
  FAILED: "#ef4444",  // Red-500
  PENDING: "#fbbf24"  // Amber-400
};

export default function CampaignLogs() {
  const { id } = useParams();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getCampaignLogs(id).then((res) => setLogs(res.data));
  }, [id]);

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 16,
  };

  const thStyle = {
    backgroundColor: "#f3f4f6",
    padding: "10px",
    border: "1px solid #d1d5db",
    textAlign: "left"
  };

  const tdStyle = {
    padding: "10px",
    border: "1px solid #d1d5db",
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h2 style={{ color: "#1f2937", marginBottom: 16 }}>Campaign Logs</h2>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Recipient</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Failure Reason</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id} style={{ background: "#f9fafb" }}>
              <td style={tdStyle}>{l.recipient_email}</td>
              <td
                style={{
                  ...tdStyle,
                  color: "white",
                  backgroundColor: statusColors[l.status] || "#6b7280",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                {l.status}
              </td>
              <td style={tdStyle}>{l.failure_reason || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
