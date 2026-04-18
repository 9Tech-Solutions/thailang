# Deploying thailang.dev

The landing page (`web/`) deploys to Vercel's free tier. The repo is
pre-configured via `vercel.json`. The only one-time steps are
connecting the Vercel project and pointing DNS at it.

## 1. Connect the repo to Vercel

1. Sign into <https://vercel.com/> with your GitHub account.
2. **Add New → Project → Import** the `9Tech-Solutions/thailang` repo.
3. On the configure screen:
   - **Framework Preset:** Next.js (auto-detected from `vercel.json`)
   - **Root Directory:** `.` (repo root; do **not** set to `web/`,
     the install script needs to run from the monorepo root to see
     the Cargo workspace)
   - **Build / Install / Output**: leave blank. All three are pinned
     in `vercel.json` and the UI values would override them if set.
4. Click **Deploy**. First build takes ~3-5 min (rustup + wasm-pack
   compile-from-source); subsequent deploys land in ~1-2 min thanks
   to Vercel's build cache.

Verify the deploy URL (e.g. `thailang-xxxx.vercel.app`) renders the
hero + samples + the interactive playground.

## 2. Point `thailang.dev` at Vercel

1. In the Vercel project: **Settings → Domains → Add**.
   Enter `thailang.dev` *and* `www.thailang.dev`.
2. Vercel will show one of two prompts:
   - **"Nameservers"**: change your registrar's nameservers to
     `ns1.vercel-dns.com` / `ns2.vercel-dns.com`. Simplest but hands
     full DNS control to Vercel.
   - **"A / CNAME records"**: keep your registrar's DNS, add:
     - Apex: `A` record → `76.76.21.21`
     - `www`: `CNAME` → `cname.vercel-dns.com`
3. Wait for DNS propagation (Vercel issues the cert automatically
   once records resolve). Usually under 10 min, up to 48 h per
   registrar.

## 3. Environment variables

None required today. When the `/playground` route adds share-via-URL
or the `/docs` route adds Pagefind indexing, they'll land here.

## 4. Preview deployments

Vercel creates a preview URL for every pull request automatically,
no extra config. The same `vercel.json` install script applies, so
previews include a fresh WASM build.

## 5. Build cost / limits

- Free tier: 100 GB-hours build time, 100 GB bandwidth/month. This
  landing site uses ~2 min x ~0.5 GB per build; fits comfortably.
- Static output (the Next `app/` route is prerendered), no serverless
  function invocations beyond the initial HTML delivery.

## Troubleshooting

**Build fails at `wasm-pack build`:**
- Check the build log for the exact Rust compile error. Most often
  this means a crate in `compiler/crates/wasm/`'s dep graph broke
  `wasm32-unknown-unknown`. Fix the crate and re-push.

**`module not found: 'playground-wasm/web'` during Next build:**
- The install script didn't run, or it ran but `build:web` failed
  silently. Check that `scripts/vercel-install.sh` is executable
  (`chmod +x`) and that `playground-wasm/package.json`'s `build:web`
  script is intact.

**Deploy works but `/` is blank / 500s:**
- Most likely the Worker can't resolve the WASM URL. Check the
  browser console on the deployed page. `new Worker(new URL(...))`
  errors surface there first.
