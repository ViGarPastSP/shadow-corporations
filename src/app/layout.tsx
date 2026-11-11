import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShadowCorps",
  description: "Espionaje, corporaciones y control territorial.",
  metadataBase: new URL("https://shadowcorp.pro"),
  icons: {
    icon: "/favicon.svg",
  },
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