# Frontend (Next.js)

This frontend is a small, statically-exported Next.js app that talks to the FastAPI backend.

## Development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## API base URL behavior

- **Development**: defaults to `http://localhost:8000` when the UI is on `localhost`
- **Production (static served by FastAPI)**: uses relative `/api/*` routes
- **Override**: set `NEXT_PUBLIC_API_URL` to a full base URL (no trailing slash)

## Key folders

- `src/components/ui`: reusable UI primitives (Button/Card/Badge/Alert/Skeleton)
- `src/features/analyze`: API client + hooks + “workspace/results” panels
- `src/components/theme`: light/dark/system theme switching
