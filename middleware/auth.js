const jwt = require('jsonwebtoken');
const User = require('../models/User');

const loadUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.locals.currentUser = null;
      return next();
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    req.user = user;
    res.locals.currentUser = user;
    next();
  } catch (error) {
    res.clearCookie('token');
    res.locals.currentUser = null;
    next();
  }
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  return next();
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).render('pages/error', {
      title: 'Forbidden',
      message: 'You are not authorized to access this page.',
    });
  }
  return next();
};

const apiRequireAuth = (req, res, next) => {
  try {
    const headerToken = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;
    const token = req.cookies.token || headerToken;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const apiRequireRole = (...roles) => async (req, res, next) => {
  const user = await User.findById(req.auth.id).select('-password');
  if (!user || !roles.includes(user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  req.user = user;
  return next();
};

module.exports = {
  loadUser,
  requireAuth,
  requireRole,
  apiRequireAuth,
  apiRequireRole,
};
