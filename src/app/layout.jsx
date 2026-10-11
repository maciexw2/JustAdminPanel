import './globals.css';

export const metadata = {
  title: 'Just AdminPanel // FiveM Control Plane',
  description: 'Precision FiveM server admin panel with real-time telemetry, txAdmin sync, and player orchestration.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logojust.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
