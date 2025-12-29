export const metadata = {
  title: "Pastebin Lite",
  description: "Simple Pastebin clone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ padding: "20px", fontFamily: "monospace" }}>
        {children}
      </body>
    </html>
  );
}
