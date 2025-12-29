export default function PasteViewer({ content, remainingViews, expiresAt }) {
  return (
    <div>
      <h2>Paste</h2>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          border: "1px solid #ccc",
          padding: "12px",
        }}
      >
        {content}
      </pre>

      {remainingViews !== null && (
        <p>Remaining views: {remainingViews}</p>
      )}

      {expiresAt && (
        <p>Expires at: {new Date(expiresAt).toLocaleString()}</p>
      )}
    </div>
  );
}
