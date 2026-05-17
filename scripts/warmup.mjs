// scripts/warmup.mjs
// Post-deployment cache warm-up script for Neon Scale-to-Zero
// Fetches all routes in ONE burst to populate unstable_cache,
// preventing scattered DB wake-ups from crawlers/visitors.

const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;
const MAX_RETRIES = 30;
const RETRY_DELAY = 2000; // 2 seconds between retries

// ─── Wait for server to be ready ────────────────────────────────
async function waitForServer() {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/health`);
      if (res.ok) {
        console.log('[warmup] ✅ Server is ready');
        return true;
      }
    } catch {
      // Server not ready yet
    }
    console.log(`[warmup] Waiting for server... (${i + 1}/${MAX_RETRIES})`);
    await new Promise(r => setTimeout(r, RETRY_DELAY));
  }
  console.error('[warmup] ❌ Server did not start in time');
  return false;
}

// ─── Fetch a single route ───────────────────────────────────────
async function fetchRoute(path) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'User-Agent': 'CacheWarmup/1.0' }
    });
    const status = res.ok ? '✅' : '⚠️';
    console.log(`[warmup] ${status} ${res.status} ${path}`);
    return res.ok;
  } catch (err) {
    console.error(`[warmup] ❌ FAIL ${path}: ${err.message}`);
    return false;
  }
}

// ─── Main warm-up logic ─────────────────────────────────────────
async function warmup() {
  console.log('[warmup] 🔥 Starting cache warm-up...');
  const start = Date.now();
  let total = 0;
  let success = 0;

  // 1. Known static routes (always exist)
  const staticRoutes = [
    '/',
    '/coordinaciones',
    '/descargas',
    '/galeria',
    '/journal',
    '/admision',
    '/nuestra-historia',
    '/centro-de-padres',
    '/api/eventos',
    '/api/popups',
  ];

  console.log(`[warmup] Phase 1: ${staticRoutes.length} static routes`);
  for (const route of staticRoutes) {
    total++;
    if (await fetchRoute(route)) success++;
    // Small delay to avoid overwhelming the server
    await new Promise(r => setTimeout(r, 200));
  }

  // 2. Parse sitemap for dynamic routes (/journal/[slug], /galeria/[id], /[slug])
  console.log('[warmup] Phase 2: Dynamic routes from sitemap');
  try {
    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    if (sitemapRes.ok) {
      const sitemapText = await sitemapRes.text();

      // Extract URLs from sitemap XML: <loc>https://domain.com/path</loc>
      const urlRegex = /<loc>(.*?)<\/loc>/g;
      let match;
      const dynamicPaths = [];

      while ((match = urlRegex.exec(sitemapText)) !== null) {
        // Convert absolute URL to relative path
        const path = match[1].replace(/https?:\/\/[^/]+/, '');
        // Skip routes we already fetched
        if (!staticRoutes.includes(path) && path !== '/') {
          dynamicPaths.push(path);
        }
      }

      console.log(`[warmup] Found ${dynamicPaths.length} dynamic routes`);

      for (const path of dynamicPaths) {
        total++;
        if (await fetchRoute(path)) success++;
        await new Promise(r => setTimeout(r, 200));
      }
    }
  } catch (err) {
    console.error(`[warmup] Sitemap parse failed: ${err.message}`);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`[warmup] 🏁 Complete! ${success}/${total} routes cached in ${elapsed}s`);
}

// ─── Entry point ────────────────────────────────────────────────
async function main() {
  const ready = await waitForServer();
  if (!ready) {
    console.log('[warmup] Skipping warm-up (server not available)');
    process.exit(0); // NEVER crash the container
  }
  await warmup();
}

main().catch(err => {
  console.error('[warmup] Fatal error:', err.message);
  process.exit(0); // NEVER crash the container
});
