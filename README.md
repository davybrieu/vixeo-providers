# Vixeo Providers

Collection of JavaScript scrapers (providers & extractors) for [Vixeo](https://github.com/davybrieu/vixeo_frontend).

These follow the same plugin format as [Nuvio providers](https://github.com/yoruix/nuvio-providers) and are compatible with Vixeo's sandboxed JavaScript plugin system (see `docs/scrapers.md` in the frontend repo).

**Local execution** (code runs on the device, not on a remote server).

Providers and extractors are ports / adaptations of those from [@movie-web/providers](https://github.com/sussy-code/providers) (used by movie-web / sudo-flix).

## Usage in Vixeo

1. In the Vixeo app, go to Settings → Plugins / Scrapers.
2. Add this **single** repository URL (one addon):
   ```
   https://raw.githubusercontent.com/davybrieu/vixeo-providers/refs/heads/main/manifest.json
   ```
3. Refresh the list.
4. In the Sources panel you will see **all the individual providers** (Autoembed, VidSrc, TheyAllSayFlix, ...).
5. Enable/disable the ones you want. You can refresh the search per title if a provider returns nothing.

## Structure

```
vixeo-providers/
├── providers/          # Ready-to-use scraper files (CommonJS, export getStreams)
│   ├── autoembed.js
│   ├── vidsrc.js
│   └── theyallsayflix.js
├── manifest.json      # Single repository manifest with multiple scrapers
└── README.md
```

## Provider format

Each scraper must export:

```js
async function getStreams(tmdbId, mediaType, season, episode) {
  // tmdbId: string, e.g. "550"
  // mediaType: "movie" | "tv"
  // season, episode: number | null
  // Return array of { url, name?, title?, quality?, headers?, provider? }
  return [{
    url: "https://...m3u8",
    name: "Server",
    quality: "1080p",
    provider: "autoembed"
  }];
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
