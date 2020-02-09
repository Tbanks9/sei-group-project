const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { secret } = require('../config/environment')

function register(req, res) {
  User
    .create(req.body)
    .then(user => res.status(201).json({ 'message': `Thanks for registering ${user.name}` }))
    .catch(err => res.json(err))
}

function login(req, res) {
  User
    .findOne({ email: req.body.email })
    .then(user => {
      if (!user || !user.validatePassword(req.body.password)) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
      const token = jwt.sign({ sub: user._id }, secret, { expiresIn: '24h' })
      res.status(202).json({
        message: `Welcome back ${user.name}`,
        token
      })
    })
    .catch(err => res.json(err))
}

function profile(req, res) {
  User
    .findById(req.currentUSer._id)
    .populate('createdUser')
    .then(user => res.status(200).json(user))
    .catch(err => res.json(err))
}

module.exports = { register, login, profile }