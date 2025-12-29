// "use client";

// import { useState } from "react";

// export default function HomePage() {
//   const [content, setContent] = useState("");
//   const [ttl, setTtl] = useState("");
//   const [views, setViews] = useState("");
//   const [url, setUrl] = useState("");
//   const [error, setError] = useState("");

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setUrl("");

//     const res = await fetch("/api/pastes", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         content,
//         ttl_seconds: ttl ? Number(ttl) : undefined,
//         max_views: views ? Number(views) : undefined,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       setError(data.error || "Something went wrong");
//       return;
//     }

//     setUrl(data.url);
//     setContent("");
//     setTtl("");
//     setViews("");
//   }

//   return (
//     <div>
//       <h1>Create Paste</h1>

//       <form onSubmit={handleSubmit}>
//         <textarea
//           rows={8}
//           style={{ width: "100%" }}
//           value={content}
//           onChange={e => setContent(e.target.value)}
//           required
//         />

//         <br /><br />

//         <input
//           placeholder="TTL (seconds)"
//           value={ttl}
//           onChange={e => setTtl(e.target.value)}
//         />

//         <input
//           placeholder="Max views"
//           value={views}
//           onChange={e => setViews(e.target.value)}
//           style={{ marginLeft: "10px" }}
//         />

//         <br /><br />

//         <button type="submit">Create</button>
//       </form>

//       {url && (
//         <p>
//           Paste URL: <a href={url}>{url}</a>
//         </p>
//       )}

//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// }
import CreatePasteForm from "@/components/CreatePasteForm";

export default function HomePage() {
  return <CreatePasteForm />;
}
