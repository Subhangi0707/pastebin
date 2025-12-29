"use client";

import { useState } from "react";

export default function CreatePasteForm() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResultUrl("");

    const payload = {
      content,
      ttl_seconds: ttl ? Number(ttl) : undefined,
      max_views: maxViews ? Number(maxViews) : undefined,
    };

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create paste");
        return;
      }

      setResultUrl(data.url);
      setContent("");
      setTtl("");
      setMaxViews("");
    } catch {
      setError("Network error");
    }
  }

  return (
    <div>
      <h2>Create a Paste</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          rows={8}
          style={{ width: "100%" }}
          placeholder="Enter your paste here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="number"
          placeholder="TTL (seconds)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max views"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <br /><br />

        <button type="submit">Create Paste</button>
      </form>

      {resultUrl && (
        <p>
          Paste URL:{" "}
          <a href={resultUrl} target="_blank">
            {resultUrl}
          </a>
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
