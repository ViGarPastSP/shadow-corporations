import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShadowCorps",
  description: "Poder, traición y control corporativo. El juego de estrategia multiplayer donde las corporaciones controlan el mundo.",
  metadataBase: new URL("https://shadowcorp.pro"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}