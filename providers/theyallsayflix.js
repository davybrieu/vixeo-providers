/**
 * TheyAllSayFlix provider for Vixeo
 * Ported from sussy-code/providers
 */

const BASE = 'https://theyallsayflix.su';

async function getStreams(tmdbId, mediaType, season, episode) {
  try {
    const params = new URLSearchParams({
      type: mediaType === 'movie' ? 'movie' : 'tv',
      tmdb_id: String(tmdbId),
    });
    if (mediaType === 'tv') {
      params.set('season', String(season));
      params.set('episode', String(episode));
    }

    const res = await fetch(`${BASE}/api/v1/search?${params}`, {
      headers: { 'Referer': BASE + '/' },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.streams || !data.streams[0] || !data.streams[0].play_url) {
      console.warn('TheyAllSayFlix: no streams');
      return [];
    }

    const streams = data.streams.map((s, i) => ({
      name: 'TheyAllSayFlix',
      title: `TheyAllSayFlix ${i + 1}`,
      url: s.play_url,
      quality: 'auto',
      headers: { Referer: BASE + '/' },
      provider: 'theyallsayflix',
    }));

    return streams;
  } catch (e) {
    console.error('TheyAllSayFlix error:', e);
    return [];
  }
}

module.exports = { getStreams };
