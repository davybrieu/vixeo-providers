# Vixeo Providers

Collection of JavaScript scrapers (providers & extractors) for [Vixeo](https://github.com/davybrieu/vixeo_frontend).

These follow the same plugin format as [Nuvio providers](https://github.com/yoruix/nuvio-providers) and are compatible with Vixeo's sandboxed JavaScript plugin system (see `docs/scrapers.md` in the frontend repo).

Providers and extractors are ports / adaptations of those from [@movie-web/providers](https://github.com/sussy-code/providers) (used by movie-web / sudo-flix).

## Usage in Vixeo

1. In the Vixeo app, go to Settings → Plugins / Scrapers.
2. Add this repository URL:
   ```
   https://raw.githubusercontent.com/davybrieu/vixeo-providers/refs/heads/main/manifest.json
   ```
3. Refresh and enable the providers you want.

## Structure

```
vixeo-providers/
├── providers/          # Ready-to-use scraper files (CommonJS, export getStreams)
│   ├── autoembed.js
│   └── ...
├── src/               # Optional multi-file sources for complex providers
├── manifest.json      # List of available scrapers
└── README.md
```

## Provider format

Each scraper must export:

```js
async function getStreams(tmdbId, mediaType, season, episode) {
  // tmdbId: string, e.g. "550"
  // mediaType: "movie" | "tv"
  // season, episode: number | null
  // Return array of { url, name?, title?, quality?, headers? }
  return [{ url: "https://...m3u8", name: "Server", quality: "1080p" }];
}
module.exports = { getStreams };
```

See the Vixeo sandbox (`assets/scrapers/sandbox.js`) for available globals: `fetch`, `URL`, `console`, etc.

## Contributing

- Port more sources/embeds from https://github.com/sussy-code/providers
- Prefer self-contained files in `providers/` for simplicity.
- Test with the Vixeo scraper-runner tools or the app.

## Disclaimer

These scrapers access third-party sites. Use at your own risk. No affiliation with the original providers or sites.
