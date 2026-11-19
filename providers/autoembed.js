/**
 * Autoembed provider for Vixeo
 * Ported from https://github.com/sussy-code/providers/blob/main/src/providers/sources/autoembed.ts
 * and embeds/autoembed.ts
 */

const BASE_URL = 'https://autoembed.cc/';

async function getStreams(tmdbId, mediaType, season, episode) {
  try {
    const params = new URLSearchParams({
      id: String(tmdbId),
    });
    if (mediaType === 'tv' && season != null && episode != null) {
      params.set('s', String(season));
      params.set('e', String(episode));
    }

    const url = `${BASE_URL}embed/player.php?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': BASE_URL,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const fileDataMatch = html.match(/"file": (\[.*?\])/s);
    if (!fileDataMatch || !fileDataMatch[1]) {
      console.warn('No file data found in Autoembed response');
      return [];
    }

    let fileData;
    try {
      // Clean trailing comma if any
      const jsonStr = fileDataMatch[1].replace(/,\s*\]$/, ']');
      fileData = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse file data:', e);
      return [];
    }

    const streams = [];
    for (const stream of fileData) {
      if (!stream.file) continue;
      const title = (stream.title || 'Unknown').trim();
      streams.push({
        name: 'Autoembed',
        title: `Autoembed ${title}`,
        url: stream.file,
        quality: title.toLowerCase().includes('1080') ? '1080p' :
                 title.toLowerCase().includes('720') ? '720p' :
                 title.toLowerCase().includes('480') ? '480p' : 'auto',
        headers: {
          Referer: BASE_URL,
        },
      });
    }

    return streams;
  } catch (error) {
    console.error('Autoembed error:', error);
    return [];
  }
}

module.exports = { getStreams };
