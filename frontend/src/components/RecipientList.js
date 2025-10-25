import React, { useEffect, useState } from "react";
import { getRecipients } from "../api";

export default function RecipientList() {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipients = () => {
    setLoading(true);
    getRecipients()
      .then(res => setRecipients(res.data))
      .catch(err => console.error("Error fetching recipients:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecipients();
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h2>All Recipients</h2>
      {loading && <p>Loading recipients...</p>}
      <table style={{ width: "100%", borderCollapse: "collapse" }} border="1">
        <thead style={{ background: "#e5e7eb" }}>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subscribed</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {recipients.map(r => (
            <tr key={r.id} style={{ background: "#f9fafb" }}>
              <td>{r.name || "-"}</td>
              <td>{r.email}</td>
              <td>{r.is_subscribed ? "Yes" : "No"}</td>
              <td>{new Date(r.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
