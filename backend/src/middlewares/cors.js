const { ALLOW_ORIGINS } = process.env;

const allowOriginsList = ALLOW_ORIGINS ? ALLOW_ORIGINS.split(';') : [];

function cors(req, res, next) {
  try {
    const { origin = '*', method } = req.headers;

    // const allowOrigin = allowOriginsList.find((d) => d === origin);

    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Headers', 'authorization,content-type,origin,ngrok-skip-browser-warning');
    res.setHeader('X-Powered-By', 'Uraaa Inc.');

    if (method === 'OPTIONS') {
      res.send('Allow: GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS');
      return;
    }

    next();
  } catch (e) {
    next(e);
  }
}

export default cors;
