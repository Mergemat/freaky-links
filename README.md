# FreakyLinks

A URL shortener that makes your innocent links look suspiciously spicy.

```
https://google.com → https://onlyfans.fr34ky.link/leaked_a8Hk2x_pics
```

## Tech Stack

- **Frontend:** TanStack Start (React 19) + Tailwind CSS + shadcn/ui
- **Backend:** Convex (database + serverless functions)
- **Hosting:** Vercel

## How It Works

1. User pastes a URL on `freakylinks.sh`
2. Convex generates a short ID and random freaky-looking URL
3. When someone visits the freaky URL on `*.fr34ky.link`:
   - Catch-all route extracts the short ID from the path
   - Queries Convex for the original URL
   - 302 redirects to the destination

### URL Format

```
https://{subdomain}.fr34ky.link/{prefix}_{shortId}_{suffix}
```

**Subdomains:** `onlyfans`, `secret-hookup`, `nudes-leaked`, `private-snap`, `tinder-leak`, etc.

**Prefixes:** `private`, `leaked`, `secret`, `unlock`, `hot`, `spicy`, etc.

**Suffixes:** `pics`, `album`, `content`, `video`, `hookup`, etc.

## Development

```bash
# Install dependencies
bun install

# Start Convex dev server (terminal 1)
npx convex dev

# Start app dev server (terminal 2)
bun run dev
```

App runs at `http://localhost:3000`

## Environment Variables

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

## Deployment

### Vercel

1. Connect repo to Vercel
2. Add environment variable `VITE_CONVEX_URL`
3. Add domains:
   - `freakylinks.sh` (main site)
   - `*.fr34ky.link` (wildcard for redirects)

### DNS

Configure your DNS provider:

```
freakylinks.sh      → CNAME to Vercel
*.fr34ky.link       → CNAME to Vercel (wildcard)
```

## Project Structure

```
├── convex/
│   ├── schema.ts      # Database schema (links table)
│   ├── generator.ts   # Freaky URL generator
│   └── links.ts       # createLink mutation + getLink query
├── src/
│   ├── routes/
│   │   ├── index.tsx  # Homepage UI
│   │   └── $.tsx      # Catch-all redirect handler
│   └── router.tsx     # Convex + React Query providers
```

## Scripts

```bash
bun run dev      # Start dev server
bun run build    # Production build
bun run preview  # Preview production build
bun x ultracite check  # Lint check
bun x ultracite fix    # Auto-fix lint issues
```

## License

MIT
