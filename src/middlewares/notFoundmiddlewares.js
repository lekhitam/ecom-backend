const signAccessToken = (user) =>
  jwt.sign({ sub: String(user._id), role: user.role }, process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' });

const signRefreshToken = (user) =>
  jwt.sign({ sub: String(user._id), role: user.role }, process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' });

  const verifyAccessToken = (token) => jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

const verifyRefreshToken = (token) => jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

module.export = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
}