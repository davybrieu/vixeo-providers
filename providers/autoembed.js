/**
 * Autoembed provider for Vixeo
 * Ported from movie-web providers, with multiple domain fallbacks.
 */

const BASES = [
  'https://autoembed.cc',
  'https://autoembed.me',
  'https://autoembed.co',
];

async function tryBase(base, tmdbId, mediaType, season, episode) {
  const params = new URLSearchParams({ id: String(tmdbId) });
  if (mediaType === 'tv' && season != null && episode != null) {
    params.set('s', String(season));
    params.set('e', String(episode));
  }
  const url = `${base}/embed/player.php?${params}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': base + '/',
      },
    });
    if (!res.ok) return [];
    const html = await res.text();
    const match = html.match(/"file": (\[.*?\])/s);
    if (!match || !match[1]) return [];
    const jsonStr = match[1].replace(/,\s*\]$/, ']');
    const fileData = JSON.parse(jsonStr);
    return fileData.filter(s => s.file).map(stream => {
      const title = (stream.title || 'Unknown').trim();
      return {
        name: 'Autoembed',
        title: `Autoembed ${title}`,
        url: stream.file,
        quality: title.toLowerCase().includes('1080') ? '1080p' :
                 title.toLowerCase().includes('720') ? '720p' :
                 title.toLowerCase().includes('480') ? '480p' : 'auto',
        headers: { Referer: base + '/' },
      };
    });
  } catch (e) {
    console.warn('Autoembed base failed:', base, e.message);
    return [];
  }
}

async function getStreams(tmdbId, mediaType, season, episode) {
  for (const base of BASES) {
    const streams = await tryBase(base, tmdbId, mediaType, season, episode);
    if (streams.length > 0) return streams;
  }
  console.warn('Autoembed: no streams on any domain');
  return [];
}

module.exports = { getStreams };
