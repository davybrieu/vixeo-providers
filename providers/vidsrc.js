/**
 * VidSrc provider for Vixeo
 * Adapted from movie-web providers (sussy-code/providers)
 * Tries current known domains.
 */

const DOMAINS = [
  'https://vidsrc.sh',
  'https://vidsrc.me',
  'https://vidsrc.to',
  'https://vidsrc.cc',
];

async function tryDomain(base, path) {
  try {
    const res = await fetch(base + path, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': base + '/',
      },
    });
    if (!res.ok) return null;
    const text = await res.text();
    const m3u8 = text.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/);
    if (m3u8) return m3u8[0];
    const file = text.match(/["']file["']\s*:\s*["'](https?:\/\/[^"']+)["']/);
    if (file) return file[1];
    return null;
  } catch (e) {
    console.warn('Domain failed:', base, e.message);
    return null;
  }
}

async function getStreams(tmdbId, mediaType, season, episode) {
  const streams = [];
  const path = mediaType === 'movie'
    ? `/embed/movie/${tmdbId}`
    : `/embed/tv/${tmdbId}/${season}/${episode}`;

  for (const domain of DOMAINS) {
    const url = await tryDomain(domain, path);
    if (url) {
      streams.push({
        name: 'VidSrc',
        title: `VidSrc (${new URL(domain).hostname})`,
        url,
        quality: 'auto',
        headers: { Referer: domain + '/' },
        provider: 'vidsrc',
      });
    }
  }

  if (streams.length === 0) {
    console.warn('VidSrc: no streams found on any domain');
  }
  return streams;
}

module.exports = { getStreams };
