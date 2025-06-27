module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-keep-it-safe-and-complex',
  jwtExpire: process.env.JWT_EXPIRE || '24h',
};