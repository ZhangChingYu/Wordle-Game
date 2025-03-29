import "./globals.css";
// import { Wordle } from "@/pages";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Wordle Here We Go!</title>
      </head>
      <body>{children}</body>
    </html>
  );
}