import "./globals.css";
import { Home, Wordle as WordleBoard } from '@/Pages';

export default function RootLayout() {
  return (
    <html lang="en">
      <title>Wordle Let's Go</title>
      <body>
        <WordleBoard/>
      </body>
    </html>
  );
}
