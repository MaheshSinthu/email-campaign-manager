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

  return (
    <form onSubmit={handleUpload}>
      <h2>Upload Recipients CSV/Excel</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Upload</button>
    </form>
  );
}
