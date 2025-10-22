import React, { useState } from "react";
import { createCampaign } from "../api";

export default function CampaignCreate() {
  const [form, setForm] = useState({
    name: "",
    subject_line: "",
    email_content: "",
    scheduled_time: "",
    status: "DRAFT", // Set a default status
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createCampaign(form).then(() => alert("Campaign Created!"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Campaign</h2>
      <input
        type="text"
        placeholder="Campaign Name"
        value={form.name} // Add value attribute for controlled component
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <br />
      <input
        type="text"
        placeholder="Subject Line"
        value={form.subject_line} // Add value attribute
        onChange={(e) => setForm({ ...form, subject_line: e.target.value })}
      />
      <br />
      <textarea
        placeholder="Email Content"
        value={form.email_content} // Add value attribute
        onChange={(e) => setForm({ ...form, email_content: e.target.value })}
      />
      <br />
      <input
        type="datetime-local"
        value={form.scheduled_time} // Add value attribute
        onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })}
      />
      <br />
      <select
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="DRAFT">Draft</option>
        <option value="SCHEDULED">Scheduled</option>
      </select>
      <br />
      <button type="submit">Create</button>
    </form>
  );
}