module.exports.checkAuthenticated = function checkAuthenticated (req, res, next) {
  req.authenticated = req.cookies['AuthToken']
  if (req.authenticated) return next()

  res.redirect('/')
}
