# Project Name

A Next.js web app with authentication (email and social sign-in) powered by [Better Auth](https://www.better-auth.com), with protected pages and deployment on Vercel.

## Features

- Email/password and social sign-in (Google / GitHub)
- Session-based authentication with Better Auth
- Protected routes: `/dashboard`, `/profile`, `/product/*`
- Route protection via `proxy.js` (Next.js 16+) or `middleware.js` (Next.js 15 and earlier), plus server-side session checks in layouts
- Ready for Vercel deployment

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- [React](https://react.dev)
- [Better Auth](https://www.better-auth.com)
- Database: MongoDB / PostgreSQL (update to match your setup)
- Hosting: [Vercel](https://vercel.com)

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
BETTER_AUTH_SECRET=your-random-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=your-database-url

# Social providers (if used)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── api/auth/[...all]/route.js   # Better Auth API handler
│   ├── dashboard/                   # Protected
│   ├── profile/                     # Protected
│   ├── product/                     # Protected
│   └── sign-in/                     # Sign-in page
├── lib/
│   ├── auth.js                      # Better Auth server config
│   └── auth-client.js               # Better Auth client
└── proxy.js                         # Route protection (middleware.js on Next 15)
```

## Deployment (Vercel)

1. Push the code to GitHub.
2. Import the repository in Vercel.
3. In **Settings → Environment Variables**, add:

   ```env
   BETTER_AUTH_SECRET=your-random-secret
   BETTER_AUTH_URL=https://your-app.vercel.app
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   DATABASE_URL=your-production-database-url
   ```

4. Redeploy (required after changing `NEXT_PUBLIC_*` variables).
5. Update the OAuth callback URLs in your Google/GitHub dashboards:

   ```
   https://your-app.vercel.app/api/auth/callback/google
   https://your-app.vercel.app/api/auth/callback/github
   ```

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `ERR_CONNECTION_REFUSED` to `localhost:3000` after deploy | Remove hardcoded `baseURL` from `auth-client.js`, or set `NEXT_PUBLIC_APP_URL` to the Vercel domain, then redeploy |
| Protected pages open without signing in | Check file name and export (`proxy` for Next 16+, `middleware` for Next 15), file location, and restart with `rm -rf .next` |
| Social login redirect error | Match the callback URL in the provider dashboard to your production domain |

## License

MIT
