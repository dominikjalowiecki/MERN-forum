function checkIfLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    res.status(210).send('');
  else
    next();
}

module.exports = checkIfLoggedIn;
