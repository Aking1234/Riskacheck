import "./globals.css";

export const metadata = {
  title: "RiskaCheck",
  description: "Rule-based website risk checker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
