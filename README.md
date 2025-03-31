# Worldle Game (Next.js + Typescript + Tailwindcss)
Project Description...

## Game Rules
- Guess the word: 1000
- Chances left: 100 per chance

## Project Directory
```t
wordle-game/
├── src/app                         # Web page contents
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Global settings
│   ├── api/                        # API Routes (to store user scores in the future)
│   ├── wordle/                     # Wordle Page
│       ├── page.tsx                # Wordle UI
│       ├── useWordle.ts            # Wordle Logics and State Management, (scalable)
│       ├── wordleService.ts        # Handle API requests, (reusable)
├── public/                         # Static resources (images, favicon)
├── package.json                    # dependencies and scripts
```