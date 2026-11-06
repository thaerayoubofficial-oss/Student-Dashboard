const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub }; // or payload.id / payload.userId
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token expired or invalid' });
  }
}

module.exports = authenticate;