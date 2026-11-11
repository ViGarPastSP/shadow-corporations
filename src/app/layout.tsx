import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShadowCorps",
  description: "Poder, traición y control. Espionaje, corporaciones y mapa mundial.",
  metadataBase: new URL("https://shadowcorp.pro"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full overflow-hidden">
      <body className="h-full overflow-hidden antialiased">
        {children}
      </body>
    </html>
  );
}