import "./globals.css";
import { Wordle as WordleBoard } from "@/Pages";

export default function RootLayout() {
  return (
    <html lang="en">
      <title>Wordle Here We Go!</title>
      <body>
        <WordleBoard/>
      </body>
    </html>
  );
}
