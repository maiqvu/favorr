import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'Authorization denied.' });
  }

  try {
    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // Add user from token's payload
    req.user = decodedToken;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}