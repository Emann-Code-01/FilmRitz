import { request } from 'axios';

export default async (req, res) => {
  try {
    const tmdbKey = process.env.TMDB_API_KEY;
    if (!tmdbKey) {
      res.status(500).json({ error: 'TMDB_API_KEY not configured on server' });
      return;
    }

    // Build TMDB URL from incoming path and forward query params
    const path = req.params?.path || [];
    // req.url includes query string; but Vercel exposes req.url
    const query = req.url.split('?')[1] || '';
    const tmdbUrl = `https://api.themoviedb.org/3/${path.join('/')}${query ? `?${query}` : ''}`;

    // Ensure api_key param is present or appended
    const separator = tmdbUrl.includes('?') ? '&' : '?';
    const urlWithKey = `${tmdbUrl}${separator}api_key=${encodeURIComponent(tmdbKey)}`;

    const method = req.method.toLowerCase();

    const axiosConfig = {
      url: urlWithKey,
      method,
      headers: {
        // Forward an accept header
        accept: 'application/json',
      },
      data: req.body,
      responseType: 'stream'
    };

    const response = await request(axiosConfig);

    // Forward status and headers
    res.status(response.status);
    Object.entries(response.headers || {}).forEach(([k, v]) => {
      try { res.setHeader(k, v); } catch { /* ignore header set errors */ }
    });

    response.data.pipe(res);
  } catch (err) {
    console.error(err);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: err.message };
    res.status(status).json(data);
  }
};
