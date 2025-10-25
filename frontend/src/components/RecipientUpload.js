import React, { useState } from "react";
import { uploadRecipients } from "../api";

export default function RecipientUpload() {
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    uploadRecipients(formData).then(() => alert("Recipients Uploaded!"));
  };

  // Style objects
  const formStyle = {
    maxWidth: 400,
    margin: "40px auto",
    background: "#e0f2fe", // light blue
    padding: 24,
    borderRadius: 10,
    boxShadow: "0 2px 10px #cbd5e1",
    textAlign: "center"
  };
  const headerStyle = {
    color: "#2563eb",
    marginBottom: 18
  };
  const inputStyle = {
    padding: "8px",
    margin: "14px 0",
    borderRadius: "6px",
    border: "1px solid #bae6fd",
    width: "100%",
    background: "#f0f9ff"
  };
  const buttonStyle = {
    padding: "10px 30px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    marginTop: "16px",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer"
  };

  return (
    <form onSubmit={handleUpload} style={formStyle}>
      <h2 style={headerStyle}>Upload Recipients CSV/Excel</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} style={inputStyle} />
      <br />
      <button type="submit" style={buttonStyle}>
        Upload
      </button>
    </form>
  );
}
