import React, { useState } from "react";
import { createCampaign } from "../api";

export default function CampaignCreate() {
  const [form, setForm] = useState({
    name: "",
    subject_line: "",
    email_content: "",
    scheduled_time: "",
    status: "DRAFT",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createCampaign(form).then(() => alert("Campaign Created!"));
  };

  // Basic style objects
  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "8px 12px",
    margin: "8px 0",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    background: "#f9fafb"
  };
  const labelStyle = {
    margin: "12px 0 3px 0",
    fontWeight: 500,
    color: "#374151"
  };
  const buttonStyle = {
    padding: "10px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    marginTop: "12px",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer"
  };
  const boxStyle = {
    maxWidth: 500,
    margin: "30px auto",
    padding: 24,
    borderRadius: 12,
    background: "#f3f4f6",
    boxShadow: "0 2px 12px 0 #e5e7eb"
  };

  return (
    <form onSubmit={handleSubmit} style={boxStyle}>
      <h2 style={{color: "#1f2937", marginBottom: 16}}>Create Campaign</h2>
      
      <label style={labelStyle}>Campaign Name</label>
      <input
        type="text"
        placeholder="Campaign Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={inputStyle}
        required
      />

      <label style={labelStyle}>Subject Line</label>
      <input
        type="text"
        placeholder="Subject Line"
        value={form.subject_line}
        onChange={(e) => setForm({ ...form, subject_line: e.target.value })}
        style={inputStyle}
        required
      />

      <label style={labelStyle}>Email Content</label>
      <textarea
        placeholder="Email Content"
        value={form.email_content}
        onChange={(e) => setForm({ ...form, email_content: e.target.value })}
        style={{...inputStyle, minHeight: 80, fontFamily: "inherit"}}
        required
      />

      <label style={labelStyle}>Scheduled Time</label>
      <input
        type="datetime-local"
        value={form.scheduled_time}
        onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })}
        style={inputStyle}
      />

      <label style={labelStyle}>Status</label>
      <select
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
        style={inputStyle}
      >
        <option value="DRAFT">Draft</option>
        <option value="SCHEDULED">Scheduled</option>
      </select>

      <button type="submit" style={buttonStyle}>Create</button>
    </form>
  );
}
