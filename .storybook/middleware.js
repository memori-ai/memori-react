// Dev-only proxy used by src/Live/HostSites.stories.tsx: host pages cannot be
// fetched from the browser because of CORS. Not available in static builds.
module.exports = function hostPageProxy(router) {
  router.get('/__host-page', async (req, res) => {
    let target;
    try {
      target = new URL(String(req.query.url || ''));
    } catch {
      res.status(400).send('Missing or invalid "url" query parameter');
      return;
    }
    if (target.protocol !== 'http:' && target.protocol !== 'https:') {
      res.status(400).send('Only http(s) URLs are allowed');
      return;
    }

    try {
      const upstream = await fetch(target.href, {
        redirect: 'follow',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml',
          'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8',
        },
      });
      const html = await upstream.text();
      res
        .status(upstream.status)
        .set('Content-Type', 'text/html; charset=utf-8')
        .set('X-Host-Page-Final-Url', upstream.url || target.href)
        .send(html);
    } catch (err) {
      res.status(502).send(`Upstream fetch failed: ${err.message || err}`);
    }
  });
};
