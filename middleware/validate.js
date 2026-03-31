const { validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  if (req.originalUrl.startsWith('/api')) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (req.originalUrl === '/register') {
    return res.status(422).render('pages/register', {
      title: 'Register',
      error: errors.array()[0].msg,
    });
  }

  if (req.originalUrl === '/login') {
    return res.status(422).render('pages/login', {
      title: 'Login',
      error: errors.array()[0].msg,
    });
  }

  return res.status(422).render('pages/error', {
    title: 'Validation Error',
    message: errors.array()[0].msg,
  });
};

module.exports = handleValidation;
