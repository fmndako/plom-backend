const checkIfAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next()
  } else {
    res.status(400).send({
      error: 'YOU ARE NOT AN ADMIN'
    })
  }
}

module.exports = {
  checkIfAdmin
}
