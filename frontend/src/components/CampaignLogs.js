import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCampaignLogs } from "../api";

export default function CampaignLogs() {
  const { id } = useParams();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getCampaignLogs(id).then((res) => setLogs(res.data));
  }, [id]);

  return (
    <div>
      <h2>Campaign Logs</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Recipient</th>
            <th>Status</th>
            <th>Failure Reason</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id}>
              <td>{l.recipient_email}</td>
              <td>{l.status}</td>
              <td>{l.failure_reason || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
